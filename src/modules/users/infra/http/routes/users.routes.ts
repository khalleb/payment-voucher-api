import { Router, Request, Response } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import { UsersController } from '../controllers/UsersController';

const routes = Router();
const controller = new UsersController();

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
  controller.store,
);

export default routes;