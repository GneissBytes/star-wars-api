import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { connect, set, connection, Connection } from 'mongoose';
import { dbConnection } from './database';
import Routes from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';
import ddos from 'ddos-express';
import { Http2Server } from 'http2';

class App {
  public app: express.Application;
  public server: Http2Server;
  public port: string | number;
  public env: string;
  public mongoConnection: Connection;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.server = this.app.listen(this.port, () => {
      logger.info(`🚀 App listening on the port ${this.port}`);
    });
    return this.server;
  }

  public getServer() {
    return this.server;
  }

  public close() {
    connection.close();
    return this.server.close();
  }

  private async connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    connect(dbConnection.url, dbConnection.options)
      .then(() => {
        logger.info('🟢 The database is connected!!!');
      })
      .catch((error: Error) => {
        logger.error(`🔴 Unable to connect to the database: ${error}.`);
      });
    this.mongoConnection = connection;
    return this.mongoConnection;
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      const ddosConfig = {
        checkInterval: 2000,
        rules: [
          {
            regexp: '^/auth.*',
            maxWeight: 10,
            queueSize: 10,
          },
          {
            regexp: '^/res.*',
            maxWeight: 20,
            queueSize: 30,
          },
        ],
      };

      this.app.use(ddos(ddosConfig));
      this.app.use(morgan('combined', { stream }));
      this.app.use(cors({ origin: 'somedomain.com', credentials: true }));
    } else if (this.env === 'development') {
      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(hpp());
    this.app.use(mongoSanitize());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'Star Wars API wrapper',
          version: '1.0.0',
          description: 'Star Wars API wrapper. Features user accounts and resource caching!',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
