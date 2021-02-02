import redis, { RedisClient } from 'redis';
import { promisify } from 'util';
import { logger } from '../utils/logger';

class AsyncRedis {
  public redisClient: RedisClient;
  public getAsync: (key: string, cb?: redis.Callback<string>) => Promise<string>;
  public setAsync: (key: string, value: string, cb?: redis.Callback<string>) => Promise<boolean>;
  public setexAsync: (key: string, seconds: number, value: string, cb?: redis.Callback<string>) => Promise<boolean>;
  public flushallAsync: () => Promise<boolean>;
  public mgetAsync: (keys: any) => Promise<string[]>;

  constructor(redisUrl = '') {
    this.redisClient = redis.createClient(redisUrl);

    this.redisClient.on('error', e => {
      logger.error('🔴 Error connecting to redis server: ', e);
    });

    this.redisClient.on('ready', () => {
      logger.info('🟢 Connection to redis is established!');
    });

    this.redisClient.on('connect', () => {
      logger.info('🚀 Stream is connected to server!');
    });

    this.initializeFunctions();
  }

  private initializeFunctions() {
    this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    this.setAsync = promisify(this.redisClient.set).bind(this.redisClient);
    this.setexAsync = promisify(this.redisClient.setex).bind(this.redisClient);
    this.flushallAsync = promisify(this.redisClient.flushall).bind(this.redisClient);
    this.mgetAsync = promisify(this.redisClient.mget).bind(this.redisClient);
  }
}

export { AsyncRedis };
