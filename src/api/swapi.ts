import axios, { AxiosInstance } from 'axios';
import HttpException from '../exceptions/HttpException';
import { AsyncRedis } from '../cache';
import { SwapiInterface } from '../interfaces/swapi.interface';

// Heart of this api. SwapiClient fetches data requested by user.
// If user requests single item for the first time, it's fetched from swapi.dev/api
// and stored for a day in Redis' memory. If user requests whole category for the first time,
// it's fetched from remote api and request is stored for a day. If item is already present
// in Redis database, it's expiration is refreshed.

export class SwapiClient implements SwapiInterface {
  redisCli: AsyncRedis;
  axiosClient: AxiosInstance;

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    this.redisCli = new AsyncRedis(process.env.REDIS_URL || '');

    this.axiosClient = axios.create({
      baseURL: 'https://swapi.dev/api',
      timeout: 10000,
    });
  }

  // Recursively fetch data from all pages and save them to redis as string representation of json object
  private fetchAllPages = async (category: string, results: Array<any> = [], url?: string) => {
    const requestPath = url ? url : `/${category}`;
    const response = await this.axiosClient.get(requestPath);
    const data = response.data;
    results.push(...data.results);
    if (data.next !== null) {
      const regex = /(\/[a-zA-Z]+\/\?page=[0-9]+)/;
      const nextUrl = data.next.match(regex)[1];

      return this.fetchAllPages(category, results, nextUrl);
    }

    const regex = /\/([0-9]+)\//;
    const keys = [];
    if (this.redisCli.redisClient.connected) {
      results.forEach(async item => {
        const itemId = item.url.match(regex)[1];
        keys.push(`${category}:items:${itemId}`);
        await this.redisCli.setexAsync(`${category}:items:${itemId}`, 24 * 3600, JSON.stringify(item));
      });
      await this.redisCli.setexAsync(`${category}:fetched`, 24 * 3599, JSON.stringify({ fetched: true, keys }));
    }

    return results;
  };

  // get category, either from remote server of redis db.
  public getCategory = async (category: string, origin = false): Promise<Array<any>> => {
    const cachedValue = this.redisCli.redisClient.connected ? JSON.parse(await this.redisCli.getAsync(`${category}:fetched`)) : false;
    if (cachedValue) {
      const { keys } = cachedValue;
      const values = await this.redisCli.mgetAsync(keys);
      const cachedData = values.map(item => {
        if (item !== '404') return JSON.parse(item);
      });
      if (origin) {
        return [cachedData, 'cache'];
      }
      return cachedData;
    } else {
      const fetchedData = await this.fetchAllPages(category);
      if (origin) {
        return [fetchedData, 'internet'];
      }
      return fetchedData;
    }
  };

  // get a single record.
  public getOne = async (category: string, id: string, origin = false): Promise<any> => {
    const cachedValue: string = this.redisCli.redisClient.connected ? await this.redisCli.getAsync(`${category}:items:${id}`) : '';
    if (cachedValue) {
      if (cachedValue === '404') throw new HttpException(404, 'Item not found');
      if (origin) return [JSON.parse(cachedValue), 'cache'];
      return JSON.parse(cachedValue);
    } else {
      try {
        const response = await this.axiosClient.get(`/${category}/${id}`);
        const data = response.data;
        const regex = /\/([0-9]+)\//;
        const itemId = data.url.match(regex)[1];
        if (this.redisCli.redisClient.connected) {
          await this.redisCli.setexAsync(`${category}:items:${itemId}`, 3600 * 24, JSON.stringify(data));
        }
        if (origin) return [data, 'internet'];
        return data;
      } catch (e) {
        if (this.redisCli.redisClient.connected) {
          await this.redisCli.setexAsync(`${category}:items:${id}`, 3600 * 24, '404');
        }
        throw new HttpException(404, 'Item not found');
      }
    }
  };

  // get size of specified category
  public getSize = async (category: string): Promise<number> => {
    const cachedLength = this.redisCli.redisClient.connected ? await this.redisCli.getAsync(`${category}:length`) : '';
    if (cachedLength) {
      return parseInt(cachedLength);
    } else {
      const response = await this.axiosClient.get(`/${category}`);
      const fetchedLength = response.data.count;
      if (this.redisCli.redisClient.connected) await this.redisCli.setexAsync(`${category}:length`, 3600 * 24, fetchedLength);
      return fetchedLength;
    }
  };

  public flushAll = async () => {
    return await this.redisCli.flushallAsync();
  };
}
