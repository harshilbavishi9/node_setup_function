import { db } from '../../cred.json';
import logger from '../utils/winston';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: db.dbHost,
  port: db.dbPort,
  username: db.dbUser,
  password: db.dbPass,
  database: db.dbName,
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*.ts'],
};

export const dataSource = new DataSource(dbConfig);

dataSource
  .initialize()
  .then(() => {
    logger.info('Postgres connected.');
  })
  .catch(error => {
    logger.info('Error connecting to the database', error);
  });
