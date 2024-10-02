import { ConnectionOptions } from 'typeorm';

export const dbConfig: ConnectionOptions = {
  type: 'postgres',
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  username: 'postgres.xlkbjgmaxgvhhllutjzo',
  password: 'man_patel_555',
  database: 'postgres',
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*.ts'],
};
