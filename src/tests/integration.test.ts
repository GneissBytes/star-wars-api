import { connect, Connection, connection } from 'mongoose';
import express from 'express';
import request from 'supertest';
import bcrypt from 'bcrypt';
import userModel from '../models/users.model';
import AuthRoute from '../routes/auth.route';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import { Server } from 'http';
import ResourcesRoute from '../routes/resources.route';
import { CreateUserDto } from '../dtos/users.dto';
import { User } from '../interfaces/users.interface';

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
    const resRoutes = new ResourcesRoute();
    app.use(express.json());

    app.use('/', authRoutes.router);
    app.use('/', resRoutes.router);
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

  afterEach(async () => {
    await clearDb();
  });

  describe('Create new user and access a category', () => {
    it('Create new user and get auth token, pass it to resource request.', async () => {
      const userData: CreateUserDto = {
        email: 'email@email.com',
        password: 'password',
      };

      const signupRes = await request(server).post('/auth/signup').send(userData);

      expect(signupRes.status).toEqual(201);
      expect(signupRes.body).toHaveProperty('token');

      const token = signupRes.body.token;

      const resourcesRes = await request(server).get('/res/planets').set('Authorization', `Bearer ${token}`).send();

      expect(resourcesRes.status).toEqual(200);
    });
  });
  describe('Create new user, log in and request a category', () => {
    it('Create new user and get auth token, pass it to resource request.', async () => {
      const userData: CreateUserDto = {
        email: 'other@email.com',
        password: 'password',
      };

      const signupRes = await request(server).post('/auth/signup').send(userData);

      expect(signupRes.status).toEqual(201);
      expect(signupRes.body).toHaveProperty('token');

      const loginRes = await request(server).post('/auth/signin').send(userData);

      expect(loginRes.status).toEqual(200);
      expect(loginRes.body).toHaveProperty('token');

      const token = loginRes.body.token;

      const resourcesRes = await request(server).get('/res/planets').set('Authorization', `Bearer ${token}`).send();

      expect(resourcesRes.status).toEqual(200);
    });
    describe("Create new user and fetch single item relevant to user's hero", () => {
      it('Create new user and get token, send a request to get particular item', async () => {
        const userData: CreateUserDto = {
          email: 'email@email.com',
          password: 'password',
        };

        const signupRes = await request(server).post('/auth/signup').send(userData);
        expect(signupRes.status).toEqual(201);
        expect(signupRes.body).toHaveProperty('token');

        const { token } = signupRes.body;

        const user: User = await userModel.findOne({ email: userData.email });
        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('heroUrl');
        const { heroUrl } = user;
        const regex = /\/([0-9]+)\//;
        const heroId = heroUrl.match(regex)[1];

        const resResponse = await request(server).get(`/res/people/${heroId}`).set('Authorization', `Bearer ${token}`).send();

        expect(resResponse.status).toEqual(200);
        const itemUrl = resResponse.body.url;
        expect(itemUrl).toEqual(heroUrl);
      });
    });
    describe("Create new user and fetch single item irrelevant to user's hero", () => {
      it('Create new user and get token, send a request to get particular item. Should return an error.', async () => {
        const userData: User = {
          email: 'email@email.com',
          password: await bcrypt.hash('password', 10),
          heroUrl: 'http://swapi.dev/api/people/1/',
        };

        const newUser = await userModel.create(userData);

        expect(newUser).toHaveProperty('_id');

        const signinRes = await request(server).post('/auth/signin').send({ email: userData.email, password: 'password' });
        expect(signinRes.status).toEqual(200);
        expect(signinRes.body).toHaveProperty('token');

        const { token } = signinRes.body;

        const user: User = await userModel.findOne({ email: userData.email });
        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('heroUrl');

        const resResponse = await request(server).get(`/res/people/2`).set('Authorization', `Bearer ${token}`).send();

        expect(resResponse.status).toEqual(401);
      });
    });
  });
});
