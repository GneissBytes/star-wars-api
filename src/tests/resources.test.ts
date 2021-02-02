import express from 'express';
import request from 'supertest';
import ResourcesRoute from '../routes/resources.route';
import jwt from 'jsonwebtoken';
import { Server } from 'http';
import { HttpTerminator, createHttpTerminator } from 'http-terminator';

describe('Testing resource routes and services', () => {
  let server: Server;
  let httpTerminator: HttpTerminator;
  let token: string;
  const heroUrl = 'http://swapi.dev/api/people/1/';

  beforeAll(() => {
    const app = express();
    app.use(express.json());
    const resourcesRoutes = new ResourcesRoute();
    app.use('/', resourcesRoutes.router);
    server = app.listen(process.env.PORT2);
    httpTerminator = createHttpTerminator({
      server,
    });
    token = jwt.sign({ heroUrl }, process.env.JWT_SECRET);
  }, 1500);

  afterAll(async done => {
    await httpTerminator.terminate();
    done();
  }, 1000);

  describe('GET /{category} with valid token', () => {
    test("Should return array of objects relevant to user's hero", async done => {
      const res = await request(server).get('/res/films').set('Authorization', `Bearer ${token}`).send();
      const data = res.body;
      data.forEach(item => {
        if (!item.characters.includes(heroUrl)) {
          throw new Error("Item is not relevant to user's hero");
        }
      });

      expect(res.status).toEqual(200);
      done();
    }, 10000);
  });
  describe('GET /{category} with invalid token', () => {
    test('Should return 401 unauthorized', async done => {
      const res = await request(server).get('/res/films').set('Authorization', `Bearer asdf`).send();

      expect(res.status).toEqual(401);
      done();
    }, 10000);
  });
  describe('GET /{category} with unknown category and valid token', () => {
    test('Should return 400', async done => {
      const res = await request(server).get('/res/film').set('Authorization', `Bearer ${token}`).send();

      expect(res.status).toEqual(409);
      done();
    }, 10000);
  });
  describe('GET /{category} with bad category value and valid token', () => {
    test('Should return 400', async done => {
      const res = await request(server).get('/res/film32134').set('Authorization', `Bearer ${token}`).send();

      expect(res.status).toEqual(400);
      done();
    }, 10000);
  });
  describe('GET /{category}/id with valid token, id and category', () => {
    test('Should return 400', async done => {
      const res = await request(server).get('/res/films/1').set('Authorization', `Bearer ${token}`).send();
      expect(res.status).toEqual(200);
      done();
    }, 10000);
  });
  describe('GET /{category}/id with valid token, invalid category or id', () => {
    test('Should return 409 invalid category', async done => {
      const res = await request(server).get('/res/film/2').set('Authorization', `Bearer ${token}`).send();

      expect(res.status).toEqual(409);
      done();
    }, 10000);
  });
  describe('GET /{category}/id with valid token, valid category, irrelevant item', () => {
    test('Should return 409 invalid category', async done => {
      const res = await request(server).get('/res/films/4').set('Authorization', `Bearer ${token}`).send();

      expect(res.status).toEqual(401);
      done();
    }, 10000);
  });
  describe("GET /{category}/id with valid token, valid category, item doesn't exist", () => {
    test('Should return 404 not found.', async done => {
      const res = await request(server).get('/res/films/43214123').set('Authorization', `Bearer ${token}`).send();

      expect(res.status).toEqual(404);
      done();
    }, 10000);
  });
});
