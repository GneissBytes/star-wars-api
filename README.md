<br />
<p align="center">
  <a href="https://i.imgur.com/aXWLAUd.png">
    <img src="https://i.imgur.com/aXWLAUd.png" alt="Project logo" width="80%">
  </a>

  <h3 align="center">StarWars API!</h3>

  <p align="center">
    Star Wars API featuring user accounts and resource caching.
    <br />
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#docker">Docker</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
      <ul> 
        <li><a href="#scripts">Scripts</a></li>
        <li><a href="#endpoints">Endpoints</li>
        <ul>
          <li><a href="#auth-endpoints">Auth Endpoints</a></li>
          <li><a href="#resource-endpoints">Resource Endpoints</a></li>
        </ul>
        <li><a href="#endpoints-summary">Endpoints summary</li>
      </ul>
    <li><a href="#design-choices">Design choices</a>
      <ul>
        <li><a href="#authentication">Authentication<a/></li>
        <li><a href="#caching">Caching</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

This is an express.js API. It features user accounts and resource caching. All content is parsed from <a href="https://swapi.dev/">SWAPI</a>.

### Built with

- [Express.js](https://expressjs.com/) is the backbone of the whole project. Numerous middlewares were used to ensure API security and data validation.
- [Mongodb](https://www.mongodb.com/) is a general-purpose document-based database. In this project, Mongo is used for storing user data.
- [Redis](https://redis.io/) is an in-memory data structure store, here used as a cache for API resources.
- [nginx](https://www.nginx.com/) is a high-performance load balancer, web server, and reverse proxy. When run with docker, nginx service could be used to expose the API.
- [Docker](https://www.docker.com/) is a virtualization service. This API works best as a multi-container application, with separate containers for the API server itself, nginx as a reverse proxy, and MongoDB and Redis for data storage.
- [Swagger](https://swagger.io/) API is used to document and explain endpoints. Swagger allows users to test the API in the browser, without the need for external tools like Postman or curl. To access documentation run this API and go to [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/) or [http://localhost:80/api-docs/](http://localhost:80/api-docs/) if running with proxy.
- [winston](https://github.com/winstonjs/winston) a logger middleware for express & [morgan](https://www.npmjs.com/package/morgan) a simple logging library. The API server will save logs and dump errors to the logs catalog in root directory.
- [Jest](https://jestjs.io//) is a JS testing framework. Individual endpoints, caching mechanism, and endpoint integration are tested. Test results are saved in a report - after every test, a test-report.html is updated in the project root directory.

## Getting started

The easiest way to run this project is to use Docker. To do this, run:

```sh
  docker-compose up -d
```

This will start the server in development mode. API can be accessed directly on localhost:3000 or through nginx proxy on localhost:80. MongoDB is exposed on localhost:27017 and Redis runs on localhost:6379.

## Prerequisites

Before downloading this repository make sure you have node.js and npm installed. Check node and npm version with:

```sh
  node --version
  npm --version
```

If you don't have either node or npm installed check instructions for your platform for [npm](https://www.npmjs.com/) and [node](https://nodejs.org/en/). This API requires running MongoDB and Redis session - MongoDB for storing user data and Redis for resources. Not having mongo will make this API unusable (all resources are secured by authentication), while the absence of Redis may cause some errors but fetching data from [swapi](https://swapi.dev/) should work. The easiest way to make sure all services are in place is running starting this app with

```sh
  docker-compose up -d
```

If you wish to use Docker, make sure you have it [installed](https://www.docker.com/).

## Installation

After downloading this repository run

```sh
  npm install
```

## Docker

Instead of installing the project, you may use Docker to automatically setup the API server and all required services. Run:

```sh
docker-compose up -d
```

in the project directory. After a short wait, all services should be installed and running in the background.

### Usage

Default environment:


<ul>
  <li>MongoDB - running at localhost:27017, DB name: swapiUsers</li>
  <li>Redis - running at localhost:6379, all settings default</li>
</ul>

## Scripts

To build js files and start the server in the production environment run:

```sh
  npm run start
```

To start the project in development mode with nodemon run:

```sh
npm run dev
```

To build the project without starting run:

```sh
npm run build
```

To test the project run:

```sh
npm run test
```

Test files are in /tests directory. A report file 'test-report.html' will be saved in the root directory with detailed descriptions of performed test and their results. Tests will fail if ran inside docker, due to configuration test must be run locally after installing the project.

Eslint and Prettier were used in this project. Prettier is an opinionated code formatter. Using Prettier can help when multiple developers work on a single project to enforce consistent code formatting. Eslint is a code analyzer for JS/TS. It helps to find problems with code quality and coding styles. To find possible errors and warnings run:

```sh
npm run lint
```

To fix found errors run:

```sh
npm run lint:fix
```

## Endpoints

Routes and endpoints are documented using Swagger. If you run the project on your own machine check [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/) (or [http://localhost:80/api-docs/](http://localhost:80/api-docs/) if with nginx proxy). Currently, any unrecognized request is redirected to API documentation. This API has two distinct main routes - /auth and /res.

### Auth endpoints

Auth routes are accessed with prefix /auth. These routes handle all available account processing. To create a new account, send a post request to /auth/signup with application/json object in the request body, containing email and password, like shown:

```js
  {
    email: "email@email.com",
    password: "password"
  }
```

If an account is successfully created, the server will respond with application/json object, containing a JSON web token used for authentication for resource routes. Example JSON response object:

```js
{
  token: "JSONWEBTOKEN",
  message: "signup"
}
```

When registering, a random Star Wars character will be assigned to the user. Only resources relevant to the user's character will be fetched to the user by resource endpoints.

<hr />
To sign in to an existing account, you must send a post request to /auth/signin. The request body must contain application/json object like the sign-up route. If logging in is successful, the server will respond with application/json object similar to one from /auth/signup endpoint.
<hr />
To delete an account you must send a delete request to /auth. In the request body, you must attach an application/json object like the one for /auth/signup and /auth/signin routes. If deletion is successful, an empty application/json object will be sent.
<hr />
Authorization JSON web tokens expire 1 day after creation. Currently, they aren't tracked and there is no whitelist nor a blacklist. Multiple sign-ins will generate new valid tokens, without invalidating older ones. Deleting an account will not invalidate existing tokens before their expiration.

### Resource endpoints

There are 4 resource endpoints, 2 unsecured and 2 secured. Open endpoints are /res and /res/:category/schema.
Get request to /res endpoint will serve a list of available resource endpoints and /res/:category/schema will serve aJSON object with a schema of a given category.

<hr />
Endpoints serving actual content are secured by token authentication. Authentication header must be set to "Bearer JWTOKEN", where JWTOKEN is a valid JSON web token, acquired from /auth/signin or /signup endpoints.
Endpoint /res/:category will fetch all records from a given category and return an array of records relevant to the user's character. If there are no records, an empty array will be returned. /res/:category/:id will fetch a given record from a given category and check if the user is authorized to receive it. If yes, then it will be served as a JSON object, if not an error will be returned.

## Endpoints summary

```
[POST] /auth/signup with body parameter application/json {"email":"email@email.com", "password":"password"} => returns application/json object {"token": "JWTOKEN", message:"signup"}

[POST] /auth/signin with body parameter application/json {"email":"email@email.com", "password":"password"} => returns application/json object {"token": "JWTOKEN", message:"signin"}

[DELETE] /auth with body parameter application/json {"email":"email@email.com", "password":"password"} => returns application/json object {}

[GET] /res => returns available categories

[GET] /res/:category with header Authorization set to "Bearer JWTOKEN" => returns all resources relevant to user's hero

[GET] /res/:category/:id with header Authorization set to "Bearer JWTOKEN" => if resource is relevant to user's hero returns it

[GET] /res/:category/schema => returns category's item schema

```

## Design choices

### Authentication

Authenticating resources uses a JSON web token. It is acquired when registering or signing in. This way a user has to send their credentials only once - resource routes accept the secure token which expires 1 day after signing. Tokens are not cached by the server - there is no white- or blacklist capabilities or token invalidation. This authorization scheme is similar to the Refresh token scheme, where the user upon signing in receives two tokens - one long-lived used to acquire new short-lived tokens used for resource endpoint authentication. Due to the scope of this project and the lack of any interactivity or data that would be confidential, this simple scheme should be enough.

### Caching

When a user requires an item, the server first checks if it has been cached to Redis memory. If not it will request it from [https://swapi.dev/api/](https://swapi.dev/api/), cache the result, and send it to the user if he is authorized. The server doesn't check if individual calls requesting a single item from a given category have saturated the whole category - the whole category is only cached when a user requests it. It makes an initial request for single items much faster, but in an edge case where users had already fetched all available items, it will result in an unnecessary fetching of the whole category. At the same time, because when the whole category is fetched all its records are refreshed, so there is no need for inventory checking logic. The initial fetch of the whole category will be relatively slow, but any future requests for a single item from given will be very quick. Automatic fetching of the whole [https://swapi.dev/api/](https://swapi.dev/api/) data every 24 hours could be a good solution for this data set - it is relatively small and users would never have to wait for fetching and caching remote resources. Redis is a high-performance data structure store and server space is relatively cheap, so depending on business task this solution could be considered.

## License

MIT License

Copyright (c) 2020 Piotr Ułasiewicz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
