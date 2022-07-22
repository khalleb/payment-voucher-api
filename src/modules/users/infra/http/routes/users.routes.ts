import { Router, Request, Response } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import { tokensServices } from '@shared/container';
import { UsersController } from '../controllers/UsersController';
import { RoutesNameType } from '@shared/commons/constants';
import { paginationRoute } from '@shared/infra/http/routes/validation.routes';

const routes = Router();
const controller = new UsersController();
const nameService: tokensServices = 'UsersServices';

const datasCreateUpdate = {
  name: Joi.string().required(),
  email: Joi.string().email().required(),
};

routes.post(
  `/${RoutesNameType.STORE}`,
  celebrate({
    [Segments.BODY]: {
      ...datasCreateUpdate,
      password: Joi.string().required(),
      password_confirmation: Joi.string().required(),
    },
  }),
  (request: Request, response: Response) => controller.store(request, response, nameService),
);

routes.put(
  `/${RoutesNameType.UPDATE}`,
  celebrate({ [Segments.BODY]: { ...datasCreateUpdate, id: Joi.string().required().uuid() } }),
  (request: Request, response: Response) => controller.update(request, response, nameService),
);

routes.get(
  `/${RoutesNameType.SHOW}`,
  celebrate({ [Segments.QUERY]: { id: Joi.string().required().uuid() } }),
  (request: Request, response: Response) => controller.show(request, response, nameService),
);

routes.get(
  `/${RoutesNameType.INACTIVATE_ACTIVATE}`,
  celebrate({ [Segments.QUERY]: { id: Joi.string().required().uuid() } }),
  (request: Request, response: Response) => controller.inactivateActivate(request, response, nameService),
);

routes.post(
  `/${RoutesNameType.INDEX}`,
  celebrate({ [Segments.BODY]: paginationRoute }),
  (request: Request, response: Response) => controller.index(request, response, nameService),
);



export default routes;
