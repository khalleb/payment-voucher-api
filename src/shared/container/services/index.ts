import { container } from 'tsyringe';
import { UsersServices } from '@modules/users/services/UsersServices';

const registeredServices = {
  usersServices: 'UsersServices',
} as const;

function registerServices() {
  container.registerSingleton<any>(
    registeredServices.usersServices,
    UsersServices,
  );
}

export { registeredServices, registerServices };
