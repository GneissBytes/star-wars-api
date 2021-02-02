import { connect, Connection, connection } from 'mongoose';
import express from 'express';
import request from 'supertest';
import { CreateUserDto } from '../dtos/users.dto';
import userModel from '../models/users.model';
import { User } from '../interfaces/users.interface';
import { DataStoredInToken } from '../interfaces/auth.interface';
import jwt from 'jsonwebtoken';
import AuthRoute from '../routes/auth.route';
import bcrypt from 'bcrypt';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import { Server } from 'http';

describe('Testing authentication features - signup, login and delete.', () => {
  let server: Server;
  let dbInstance: Connection;
  let httpTerminator: HttpTerminator;
  const testDb = 'dbTest';
  const clearDb = async () => {
    if (userModel.db.name === testDb) {
      await userModel.deleteMany({});
    } else {
      throw new Error('Invalid database detected');
    }
  };
  beforeAll(async () => {
    const app = express();
    const authRoutes = new AuthRoute();
    app.use(express.json());

    app.use('/', authRoutes.router);
    server = app.listen(process.env.PORT1);
    httpTerminator = createHttpTerminator({
      server,
    });
    const dbConnection = {
      url: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
    };
    connect(dbConnection.url, dbConnection.options)
      .then(() => {
        console.log('🟢 The database is connected!!!');
      })
      .catch((error: Error) => {
        console.log(`🔴 Unable to connect to the database: ${error}.`);
      });

    dbInstance = connection;

    await clearDb();
  }, 1500);

  afterAll(async done => {
    await httpTerminator.terminate();
    await clearDb();
    dbInstance.close(done);
  }, 1000);

  describe('POST /auth/signup with new user', () => {
    it('New user should be registered and saved to database. User must be assigned a random character from Star Wars API. Response should contain jwt token and success message.', async () => {
      const userData: CreateUserDto = {
        email: `email@email.com`,
        password: 'password',
      };

      const res = await request(server).post('/auth/signup').send(userData);
      const user: User = await userModel.findOne({ email: userData.email });
      if (!user) throw new Error('User was not saved');

      const token = res.body.token;
      const verifiedToken = (await jwt.verify(token, process.env.JWT_SECRET)) as DataStoredInToken;

      if (verifiedToken.heroUrl !== user.heroUrl) throw new Error("Token hero url doesn't match database records");

      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/signup with existing user', () => {
    it('Should return status 409 and inform about already used email.', async () => {
      const userData: CreateUserDto = {
        email: `email@email.com`,
        password: 'password',
      };

      if (!(await userModel.find({ email: userData.email }))) {
        await userModel.create(userData);
      }
      const res = await request(server).post('/auth/signup').send(userData);

      expect(res.status).toEqual(409);
      expect(res.error);
    });
  });

  describe('POST /auth/signup with incorrect parameters', () => {
    it('Should return status 400 with error explaining wrong/missing properties.', async () => {
      const userData = {};

      const res = await request(server).post('/auth/signup').send(userData);

      expect(res.status).toEqual(400);
      expect(res.error);
    });
  });
  describe('POST /auth/login with existing credentials', () => {
    it('Should return JWT token used for authenticating resources routes', async () => {
      const userData: CreateUserDto = {
        email: 'email@email.com',
        password: 'password',
      };

      let user;

      if (!(await userModel.find({ email: userData.email }))) {
        user = await userModel.create({
          email: userData.email,
          password: bcrypt.hash(userData.password, 10),
          heroUrl: 'https://swapi.dev/api/people/1/',
        });
      } else {
        user = await userModel.findOne({ email: userData.email });
      }
      const res = await request(server).post('/auth/signin').send(userData);

      const token = res.body.token;
      try {
        const verifiedToken = (await jwt.verify(token, process.env.JWT_SECRET)) as DataStoredInToken;
        if (verifiedToken.heroUrl !== user.heroUrl) throw new Error("Token hero url doesn't match database records");
      } catch (e) {
        throw new Error(e.message);
      }

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('message');
    });
  });
  describe('POST /auth/login with existing email and wrong password', () => {
    it('Should return message informing about authentication failure', async () => {
      const userData: CreateUserDto = {
        email: 'email@email.com',
        password: 'password',
      };

      const userDataTest: CreateUserDto = {
        email: 'email@email.com',
        password: 'wrongPassword',
      };

      if (!(await userModel.find({ email: userData.email }))) {
        await userModel.create({
          email: userData.email,
          password: bcrypt.hash(userData.password, 10),
          heroUrl: 'https://swapi.dev/api/people/1/',
        });
      }
      const res = await request(server).post('/auth/signin').send(userDataTest);

      expect(res.status).toEqual(409);
    });
  });
  describe('POST /auth/login with incorrect request body', () => {
    it('Should respond with 400 and message explaining missing or invalid parameters.', async () => {
      const res = await request(server).post('/auth/signin').send({});

      expect(res.status).toEqual(400);
    });
  });
  describe('DELETE /auth with invalid credentials', () => {
    it('Should return 409 unauthorized', async () => {
      const userData: CreateUserDto = {
        email: 'email@email.com',
        password: 'password',
      };

      const userDataTest: CreateUserDto = {
        email: 'email@email.com',
        password: 'wrongpassword',
      };

      if (!(await userModel.find({ email: userData.email }))) {
        await userModel.create({
          email: userData.email,
          password: bcrypt.hash(userData.password, 10),
          heroUrl: 'https://swapi.dev/api/people/1/',
        });
      }

      const res = await request(server).delete('/auth').send(userDataTest);
      expect(res.status).toEqual(409);
    });
  });
  describe('DELETE /auth with empty body or invalid parameters', () => {
    it('Should return 400 describing invalid or missing parameters', async () => {
      const res = await request(server).delete('/auth').send({});
      expect(res.status).toEqual(400);
    });
  });
  describe('DELETE /auth with unregistered email', () => {
    it('Should return 409 with invalid credentials', async () => {
      const userData: CreateUserDto = {
        email: 'bademail@email.com',
        password: 'password',
      };

      await userModel.deleteMany({ email: userData.email });

      const res = await request(server).delete('/auth').send(userData);
      expect(res.status).toEqual(404);
    });
  });
  describe('DELETE /auth with valid parameters', () => {
    it('Should remove provided user from database and return empty object', async () => {
      const userData: CreateUserDto = {
        email: 'email@email.com',
        password: 'password',
      };

      if (!(await userModel.find({ email: userData.email }))) {
        await userModel.create({
          email: userData.email,
          password: bcrypt.hash(userData.password, 10),
          heroUrl: 'https://swapi.dev/api/people/1/',
        });
      }

      const res = await request(server).delete('/auth').send(userData);

      const foundUser = await userModel.findOne({ email: userData.email });
      if (foundUser) throw new Error('User not deleted from database');

      expect(res.status).toEqual(202);
      expect(res.body).toEqual({});
    });
  });
});
