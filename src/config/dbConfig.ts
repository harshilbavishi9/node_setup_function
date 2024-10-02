import { ConnectionOptions } from 'typeorm';
import { appConfig } from './appConfig';

export const dbConfig: ConnectionOptions = {
  type: appConfig.db.dbType,
  host: appConfig.db.dbHost,
  port: appConfig.db.dbPort,
  username: appConfig.db.dbUser,
  password: appConfig.db.dbPass,
  database: appConfig.db.dbName,
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*.ts'],
};
