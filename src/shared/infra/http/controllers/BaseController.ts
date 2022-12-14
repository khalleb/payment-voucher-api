import { Request, Response } from 'express';

import httpStatus from 'http-status';
import { container } from 'tsyringe';

import { tokensServices } from '@shared/container';
import { IPaginateOptions } from '@shared/infra/prisma/core/Pagination';
import { cleanObject } from '@shared/utils/objectUtil';

import { IServicesBase } from '../services/IServicesBase';

export abstract class BaseController<T extends IServicesBase> {
  public async store(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const object = await (service.store && service.store(request));
    return response.status(httpStatus.CREATED).json(cleanObject(object));
  }

  public async update(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const object = await (service.update && service.update(request));
    return response.status(httpStatus.OK).json(cleanObject(object));
  }

  public async delete(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const status = await (service.delete && service.delete(request));
    return response.json(status);
  }

  public async show(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const object = await (service.show && service.show(request));
    return response.json(cleanObject(object));
  }

  public async inactivateActivate(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const status = await (service.inactivateActivate && service.inactivateActivate(request));
    return response.json(status);
  }

  public async index(request: Request, response: Response, serviceName: tokensServices): Promise<any> {
    const service = container.resolve<T>(serviceName);
    const datasPagination: IPaginateOptions = request.body;
    const data = await (service.index && service.index(datasPagination));
    return response.json(cleanObject(data));
  }
}

export default BaseController;
