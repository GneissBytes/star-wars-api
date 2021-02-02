import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { isEmpty } from '../utils/util';
import { SwapiClient } from '../api/swapi';

class AuthService {
  public users = userModel;
  private SwapiClient = new SwapiClient();

  public async signup(userData: CreateUserDto): Promise<string> {
    if (isEmpty(userData)) throw new HttpException(400, 'Credentials required - check if email and password is attached.');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `Email ${userData.email} is already registered`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const count = await this.SwapiClient.getSize('people');
    // swapi returns count = array length, api indexes start with 1
    const heroIndexes = count + 1;
    const heroId = Math.floor(Math.random() * (heroIndexes - 1)) + 1;
    const heroUrl = `http://swapi.dev/api/people/${heroId}/`;
    const createUserData: User = await this.users.create({ ...userData, heroUrl, password: hashedPassword });
    const userToken = this.createToken(createUserData);

    return userToken;
  }

  public async login(userData: CreateUserDto): Promise<string> {
    if (isEmpty(userData)) throw new HttpException(400, 'Credentials required - check if email and password is attached.');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `Invalid credentials`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Invalid credentials');

    const tokenData = this.createToken(findUser);
    await this.users.findOneAndUpdate({ email: userData.email }, { validToken: tokenData });

    return tokenData;
  }

  public async deleteUser(userData: CreateUserDto) {
    const findUser = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(404, 'User not found');
    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Invalid credentials');
    const response = await this.users.deleteOne({ email: userData.email });
    return response;
  }

  public createToken(user: User): string {
    const dataStoredInToken: DataStoredInToken = { heroUrl: user.heroUrl };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn = '1d';

    return jwt.sign(dataStoredInToken, secret, { expiresIn });
  }
}

export default AuthService;
