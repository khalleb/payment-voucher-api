import { Router, Request, Response } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import { tokensServices } from '@shared/container';
import { UsersController } from '../controllers/UsersController';

const routes = Router();
const controller = new UsersController();
const nameService: tokensServices = 'UsersServices';

routes.post(
  `/store`,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required(),
    },
  }),
  (request: Request, response: Response) => controller.store(request, response, nameService),
);

export default routes;
