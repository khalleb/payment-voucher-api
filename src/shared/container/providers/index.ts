import { container } from 'tsyringe';

import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';
import { IHashProvider } from './HashProvider/models/IHashProvider';

const registeredProviders = {
  hashProvider: 'HashProvider',
} as const;

function registerProviders() {
  container.registerSingleton<IHashProvider>(registeredProviders.hashProvider, BCryptHashProvider);
}

export { registeredProviders, registerProviders };
