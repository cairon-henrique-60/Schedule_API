import { DataSource } from 'typeorm';
import * as path from 'path';

import { ENV_VARIABLES } from 'src/config/env.config';

const entitiesPath = path.resolve(__dirname, '../../**/*.entity{.ts,.js}');
const migrationsPath = path.resolve(
  __dirname,
  '../../lib/database/migrations/{*.ts,*.js}',
);

const dataSource = new DataSource({
  type: 'mysql',
  host: ENV_VARIABLES.DB_HOST,
  port: +ENV_VARIABLES.DB_PORT,
  username: ENV_VARIABLES.DB_USER,
  password: ENV_VARIABLES.DATABASE_ROOT_PASSWORD,
  database: ENV_VARIABLES.DATABASE_DATABASE_NAME,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false,
  migrationsRun: true,
  logging: true,
});

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
