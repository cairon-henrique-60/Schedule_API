import { DataSource } from 'typeorm';
import { Client } from '../entities/client.entity';

export const clientsProviders = [
  {
    provide: 'CLIENTS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Client),
    inject: ['DATA_SOURCE'],
  },
];
