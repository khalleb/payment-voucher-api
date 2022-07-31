import { Router } from 'express';

import categoriesRoute from '@modules/categories/infra/http/routes/categories.routes';
import usersRoute from '@modules/users/infra/http/routes/users.routes';

import { Routes } from '@shared/commons/constants';

const routes = Router();

routes.use(`/${Routes.USER}`, usersRoute);
routes.use(`/${Routes.CATEGORY}`, categoriesRoute);

export { routes };
