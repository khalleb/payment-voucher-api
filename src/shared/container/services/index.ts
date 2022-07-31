import { container } from 'tsyringe';

import { CategoriesServices } from '@modules/categories/services/CategoriesServices';
import { UsersServices } from '@modules/users/services/UsersServices';

import { IServicesBase } from '@shared/infra/http/services/IServicesBase';

const registeredServices = {
  usersServices: 'UsersServices',
  categoriesServices: 'CategoriesServices',
} as const;

function registerServices() {
  container.registerSingleton<IServicesBase>(registeredServices.usersServices, UsersServices);
  container.registerSingleton<IServicesBase>(registeredServices.categoriesServices, CategoriesServices);
}

export { registeredServices, registerServices };
