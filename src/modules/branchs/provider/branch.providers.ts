import { DataSource } from 'typeorm';
import { Branch } from '../entities/branch.entity';
export const branchsProviders = [
  {
    provide: 'BRANCH_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Branch),
    inject: ['DATA_SOURCE'],
  },
];