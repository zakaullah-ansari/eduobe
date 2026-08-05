import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import redisConfig from './redis.config';
import storageConfig from './storage.config';
import mailConfig from './mail.config';
import aiConfig from './ai.config';

export const loadConfig = [
  appConfig,
  databaseConfig,
  jwtConfig,
  redisConfig,
  storageConfig,
  mailConfig,
  aiConfig,
];

export {
  appConfig,
  databaseConfig,
  jwtConfig,
  redisConfig,
  storageConfig,
  mailConfig,
  aiConfig,
};
