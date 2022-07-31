import { UsersServices } from '@modules/users/services/UsersServices';

import BaseController from '@shared/infra/http/controllers/BaseController';

class UsersController extends BaseController<UsersServices> {}

export { UsersController };
