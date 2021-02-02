import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import AuthService from '../services/auth.service';
import userModel from '../models/users.model';

// Auth controller, verifies request data and calls auth services for creating or removing user account or loggin in
class AuthController {
  public authService = new AuthService();
  public user = userModel;

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const token: string = await this.authService.signup(userData);
      res.status(201).json({ token, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const token: string = await this.authService.login(userData);
      res.status(200).json({ token, message: 'signin' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      if (!userData) next(new HttpException(401, 'User data required'));
      await this.authService.deleteUser(userData);
      res.status(202).send({});
    } catch (e) {
      next(e);
    }
  };
}

export default AuthController;
