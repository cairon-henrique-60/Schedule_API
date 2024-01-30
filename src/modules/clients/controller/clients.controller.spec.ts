import { Test, TestingModule } from '@nestjs/testing';

import { Client } from '../entities/client.entity';

import { Branch } from '../../../modules/branchs/entities/branch.entity';

import { ClientsController } from './clients.controller';
import { ClientsService } from '../services/clients.service';

describe('ClientsController', () => {
  let controller: ClientsController;

  const mockClient = new Client();
  const mockBranch = new Branch();

  mockBranch.id = 1;
  mockBranch.createdAt = '2024-01-23T11:22:24.000Z';
  mockBranch.updatedAt = '2024-01-23T11:22:24.000Z';
  mockBranch.deletedAt = null;
  mockBranch.branch_name = 'Barber';
  mockBranch.cnpj = '12345678000200';
  mockBranch.street = 'Rua Alameda';
  mockBranch.cep = '36150000';
  mockBranch.city = 'New York';
  mockBranch.opening_hours = '08:00';
  mockBranch.closing_hours = '18:00';
  mockBranch.user_id = 1;
  mockBranch.district = 'Broklyn';
  mockBranch.local_number = '230B';
  mockBranch.complements = 'Main Street';

  mockClient.id = 1;
  mockClient.createdAt = '2024-01-30T11:24:40.000Z';
  mockClient.updatedAt = '2024-01-30T11:24:40.000Z';
  mockClient.deletedAt = null;
  mockClient.client_name = 'John';
  mockClient.first_name = 'Doe';
  mockClient.birth_date = '11/03/1994';
  mockClient.client_phone = '32227568';
  mockClient.is_active = true;
  mockClient.branch_id = mockBranch.id;
  mockClient.branch = mockBranch;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [ClientsService],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
