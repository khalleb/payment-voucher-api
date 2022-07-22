import { Router } from 'express';
import usersRoute from '@modules/users/infra/http/routes/users.routes';
import { Routes } from '@shared/commons/constants';

const routes = Router();

routes.use(`/${Routes.USER}`, usersRoute);

export { routes };
