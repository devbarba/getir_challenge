import * as dotenv from 'dotenv-safe';
import { getEnv } from '../utils/helper';

dotenv.config();

export default {
  env: getEnv('APP_ENV', 'local'),
  host: getEnv('HOST', '0.0.0.0'),
  port: getEnv('PORT', 3000),
  timezone: getEnv('APP_TZ', 'Europe/Rome'),
  mongo_uri: getEnv('MONGO_URI', ''),
};
