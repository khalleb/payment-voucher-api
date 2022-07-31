import express, { Express } from 'express';

import { errors } from 'celebrate';

import { registerDependencies } from '@shared/container';
import { env } from '@shared/env';
import { AppLogger } from '@shared/logger';
import { nameProject } from '@shared/utils/stringUtil';

import { errorConverter, errorHandler } from '../../errors/Error';
import { getEnvironment, getVersion } from '../devops/version';
import { routes } from './routes';

class Server {
  public app: Express;

  constructor() {
    registerDependencies();

    this.app = express();
    // JSON space
    this.app.set('json spaces', 2);
    this.app.disable('x-powered-by');
    // Inactive error 304
    this.app.disable('etag');

    // parse json request body
    this.app.use(express.json());

    this.routes();
    this.errorHandlers();
  }

  private routes() {
    this.app.use(routes);
  }

  private errorHandlers() {
    // convert error to ApiError, if needed
    this.app.use(errorConverter);
    // handle error
    this.app.use(errorHandler);
    // get celebrate errors
    this.app.use(errors());
  }

  public async start() {
    this.app
      .listen(env.APP_API_PORT, () => {
        AppLogger.info({
          message: `🚀 Server ${nameProject().toUpperCase()} started on port ${
            env.APP_API_PORT
          } in mode ${getEnvironment()} - VERSION: ${getVersion()}`,
        });
      })
      .on('error', error => {
        AppLogger.error({
          message: `
        ********************************************
        🔥 ERROR STARTING SERVER ${error}
        ********************************************
        `,
        });
        process.exit(1);
      });
  }
}

export const server = new Server();
