import * as dotenv from 'dotenv-safe';

import { getEnv } from '../utils/helper';

dotenv.config();

export default {
    env: getEnv('APP_ENV', 'local'),
    host: getEnv('HOST', '0.0.0.0'),
    port: getEnv('PORT', 3000),
    timezone: getEnv('APP_TZ', 'Europe/Rome'),
    mongo: {
        host: getEnv('MONGO_HOST', '', true),
        name: getEnv('MONGO_DB_NAME', '', true),
        user: getEnv('MONGO_USER', '', true),
        pass: getEnv('MONGO_PASS', '', true),
    },
};
