import { AppLogger } from '@shared/logger';

//import { registerProviders, registeredProviders } from './providers';
import { registerServices, registeredServices } from './services';

const registeredDependencies = {
  //...registeredProviders,
  ...registeredServices,
};

AppLogger.info({
  type: 'DEPENDENCIES REGISTERED',
  message: Object.values(registeredDependencies),
});

function registerDependencies() {
  //registerProviders();
  registerServices();
}

const tokenValuesServices = Object.values({ ...registeredServices });

type tokensServices = typeof tokenValuesServices[number];
export { registeredDependencies, registerDependencies, tokensServices };
