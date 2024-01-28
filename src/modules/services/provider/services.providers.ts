import { DataSource } from 'typeorm';
import { Service } from '../entities/service.entity';

export const servicesProviders = [
  {
    provide: 'SERVICES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Service),
    inject: ['DATA_SOURCE'],
  },
];
