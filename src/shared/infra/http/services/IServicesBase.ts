import { Request } from 'express';


interface IServicesBase {
  datasValidate(data: any): Promise<any>;
  store(data: Request): Promise<any>;
  update(data: Request): Promise<any>;
  delete(data: Request): Promise<any>;
  show(data: Request): Promise<any | undefined>;
  inactivateActivate(data: Request): Promise<any>;
  //index?(data: IPagination): Promise<IPaginationAwareObject>;
}

export { IServicesBase };
