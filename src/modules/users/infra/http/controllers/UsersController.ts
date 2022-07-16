import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UsersServices } from '@modules/users/services/UsersServices';

class UsersController {
  public async store(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(UsersServices);
    const result = await service.store(request);
    return response.json(result);
  }
}

export { UsersController };
