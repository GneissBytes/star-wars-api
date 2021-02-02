import { Request } from 'express';

export interface DataStoredInToken {
  heroUrl: string;
}

export interface ResponseWithToken {
  token: string;
  message: string;
}

export interface RequestWithToken extends Request {
  token: string;
  heroUrl?: string;
}

export interface RequestWithHeroUrl extends Request {
  heroUrl: string;
}
