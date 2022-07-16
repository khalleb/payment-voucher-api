import { Request, Response, NextFunction } from 'express';
import { CelebrateError, isCelebrateError } from 'celebrate';
import httpStatus from 'http-status';

import AppError from './AppError';
import { env } from '../env';
import { AppLogger } from '../logger';

export function errorConverter(err: any, request: Request, response: Response, next: NextFunction): any {
  let error = err;

  if (!error?.statusCode) {
    if (isCelebrateError(error) && error instanceof CelebrateError) {
      const mapErrors = new Map(error.details);
      let errorCelebrate = '';
      mapErrors.forEach(value => {
        errorCelebrate = `${errorCelebrate} ${value.message}`;
      });
      error.message = errorCelebrate ? errorCelebrate.trim() : error.message;
      error = new AppError(error.message, httpStatus.BAD_REQUEST, err.stack);
      // } else if (error instanceof MulterError) {
      //   error.message = i18n('validations.storage_max_size', { max: env.STORAGE_MAX_SIZE_MEGABYTES.toString() });
      //   error = new AppError(error.message, httpStatus.BAD_REQUEST, err.stack);
    } else {
      error = new AppError(error.message, httpStatus.INTERNAL_SERVER_ERROR, err.stack);
    }
  }
  next(error);
}

export function errorHandler(error: any, request: Request, res: Response, _: NextFunction): void {
  let statusCode = httpStatus.NOT_FOUND;
  let message = 'Error application';
  if (error?.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }
  res.locals.errorMessage = error.message;

  const response = {
    status: statusCode,
    message,
    ...(env.isDevelopment && { stack_dev: error.stack }),
  };

  if (env.isDevelopment) {
    AppLogger.error({ error });
  }
  res.status(statusCode).json(response);
}
