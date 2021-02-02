import { SwapiClient } from '../api/swapi';
import { AsyncRedis } from '../cache/index';
const api = new SwapiClient();
const cache = new AsyncRedis();

describe('Testing if requests are being cached to Redis memory', () => {
  beforeAll(async () => {
    // clear existing cache
    await api.flushAll();
  });

  afterAll(async done => {
    await api.flushAll();
    await cache.redisClient.quit(done);
  }, 5000);

  describe('Get item from swapi before caching', () => {
    it('Item should be cached with axios and cached', async done => {
      const before = await cache.getAsync('people:items:1');
      if (before) throw new Error('Item already in cache');
      const [data, source] = await api.getOne('people', '1', true);
      const after = await cache.getAsync('people:items:1');

      if (JSON.stringify(data) !== after) throw new Error("Item wasn't cached");
      expect(source).toEqual('internet');
      done();
    });
  });
  describe('Get cached item from redis memory', () => {
    it('Item should be retrieved much quicker after it has been cached', async done => {
      const [_data, source] = await api.getOne('people', '1', true);

      expect(source).toEqual('cache');
      done();
    });
  });
  describe('Get category from the internet', () => {
    it('Item should be retrieved using redis from swapi. Can take some time', async done => {
      const [_data, source] = await api.getCategory('people', true);

      expect(source).toEqual('internet');
      done();
    });
  });
  describe('Get category from cache', () => {
    it('Item should be retrieved from cache. Should be very fast', async done => {
      const [_data, source] = await api.getCategory('people', true);

      expect(source).toEqual('cache');
      done();
    });
  });
  describe('Compare item from cache and from the internet', () => {
    it('Fetch same item, once from the internet, once from cache and check if they are the same item.', async done => {
      await api.flushAll();
      const [remoteItem, remoteOrigin] = await api.getOne('people', '1', true);
      const [cachedItem, cacheOrigin] = await api.getOne('people', '1', true);

      if (remoteOrigin === cacheOrigin) throw new Error(`Both items originate from the same source: ${remoteOrigin}.`);
      if (JSON.stringify(remoteItem) !== JSON.stringify(cachedItem)) throw new Error(`The items are different.`);
      done();
    }, 10000);
  });
  describe('Fetch whole category from api and cache and compare them', () => {
    it('Fetch same item, once from the internet, once from cache and check if they are the same item.', async done => {
      await api.flushAll();
      const [remoteItem, remoteOrigin] = await api.getCategory('people', true);
      const [cachedItem, cacheOrigin] = await api.getCategory('people', true);

      if (remoteOrigin === cacheOrigin) throw new Error(`Both items originate from the same source: ${remoteOrigin}.`);
      if (JSON.stringify(remoteItem) !== JSON.stringify(cachedItem)) throw new Error(`The items are different.`);
      done();
    }, 10000);
  });
  describe('Fetch whole category from api the internet and afterwards fetch single item.', () => {
    it('After fetching whole category, the one fetched item should originate from the cache.', async done => {
      await api.flushAll();
      const [_remoteItem, remoteOrigin] = await api.getCategory('people', true);
      const [_cachedItem, cacheOrigin] = await api.getOne('people', '1', true);

      if (remoteOrigin === cacheOrigin) throw new Error(`Both items originate from the same source: ${remoteOrigin}.`);
      done();
    }, 10000);
  });
});
