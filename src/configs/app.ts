import { getEnv } from '../utils/helper';

export default {
  env: getEnv('APP_ENV', 'local'),
  host: getEnv('HOST', '0.0.0.0'),
  port: getEnv('PORT', 3000),
  timezone: getEnv('APP_TZ', 'Europe/Rome')
};
