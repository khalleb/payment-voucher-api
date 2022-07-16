import { Request, Response } from 'express';
import { UsersServices } from '../../../services/UsersServices';

class UsersController {
  public async store(request: Request, response: Response): Promise<Response> {
    const usersServices = new UsersServices();
    const result = await usersServices.store(request);
    return response.json(result);
  }
}

export { UsersController };