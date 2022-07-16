import 'dotenv/config';
import { cleanEnv, str, port, url, num } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'], example: 'development', default: 'development' }),

  CORS_HOSTS: str({ example: 'http://localhost:3000;localhost:3000' }),

  APP_API_PORT: port({ example: '3333' }),
  NAME_PROJECT: str({ example: `NAME_PROJECT` }),
  LOG_LEVEL: str({ choices: ['debug', 'info', 'warn', 'error', 'fatal'], example: 'debug', default: 'debug' }),
});
export { env };