import { AxiosInstance } from 'axios';
import { AsyncRedis } from '../cache';

export interface SwapiInterface {
  redisCli: AsyncRedis;
  axiosClient: AxiosInstance;
}
