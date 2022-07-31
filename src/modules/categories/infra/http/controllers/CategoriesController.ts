import { CategoriesServices } from '@modules/categories/services/CategoriesServices';

import BaseController from '@shared/infra/http/controllers/BaseController';

class CategoriesController extends BaseController<CategoriesServices> {}

export { CategoriesController };
