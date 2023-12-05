import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(async () => {
    Logger.log('Data Source has been initialized!', 'Database');
  })
  .catch((err) => {
    Logger.error('Error during Data Source initialization');
    Logger.error(err);
    Logger.error('Error during Data Source initialization');
  });

export default dataSource;
