import { container } from 'tsyringe';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';
import { IHashProvider } from './HashProvider/models/IHashProvider';
import { PrismaProvider } from './Prisma/implementations/PrismaProvider';
import { IPrismaProvider } from './Prisma/models/IPrismaProvider';

const registeredProviders = {
  hashProvider: 'HashProvider',
  prismaProvider: 'PrismaProvider',
} as const;

function registerProviders() {
  container.registerSingleton<IHashProvider>(registeredProviders.hashProvider, BCryptHashProvider);
  container.registerSingleton<IPrismaProvider>(registeredProviders.prismaProvider, PrismaProvider);
}

export { registeredProviders, registerProviders };
