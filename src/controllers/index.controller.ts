import { NextFunction, Request, Response } from 'express';

//index controller is just only for redirecting stray requests to API reference
class IndexController {
  public index = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(307).redirect('/api-docs/');
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
