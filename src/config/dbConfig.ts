import { DataSource, DataSourceOptions } from 'typeorm';
import { appConfig } from './appConfig';

export const dbConfig: DataSourceOptions = {
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

export const dataSource = new DataSource(dbConfig);

dataSource
  .initialize()
  .then(() => {
    console.log('Postgres connected.');
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });
