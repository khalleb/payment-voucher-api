import { Request } from 'express';
import { IPaginatedResult, IPaginateOptions } from '@shared/infra/prisma/core/Pagination';


interface IServicesBase {
  datasValidate(data: any): Promise<any>;
  store(request: Request): Promise<any>;
  update(request: Request): Promise<any>;
  delete(request: Request): Promise<any>;
  show(request: Request): Promise<any | undefined>;
  inactivateActivate(request: Request): Promise<any>;
  index(data: IPaginateOptions): Promise<IPaginatedResult>;
}

export { IServicesBase };
