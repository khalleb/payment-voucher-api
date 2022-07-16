import { Router } from 'express';
import usersRoute from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use(`/users`, usersRoute);

export { routes };
