import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, RequestWithToken } from '../interfaces/auth.interface';

// Parse received bearer token and add user's hero url to request so authentication can be resolved
const authMiddleware = async (req: RequestWithToken, _res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) return next(new HttpException(406, 'Token not found'));

    const token = authorization.replace('Bearer ', '');

    if (token) {
      const secret = process.env.JWT_SECRET;
      const verifiedToken = (await jwt.verify(token, secret)) as DataStoredInToken;
      const heroUrl = verifiedToken.heroUrl;

      if (heroUrl) {
        req.heroUrl = heroUrl;
        next();
      } else {
        next(new HttpException(401, 'Token authorization failure'));
      }
    } else {
      next(new HttpException(401, 'Token not found'));
    }
  } catch (error) {
    next(new HttpException(401, 'Token authorization failure'));
  }
};

export default authMiddleware;
