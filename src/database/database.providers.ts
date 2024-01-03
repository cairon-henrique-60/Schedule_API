import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: process.env.DATABASE_ROOT_PASSWORD,
        database: process.env.DATABASE_DATABASE_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/**/migrations/{*.ts,*.js}'],
        synchronize: false,
        migrationsRun: true,
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];
