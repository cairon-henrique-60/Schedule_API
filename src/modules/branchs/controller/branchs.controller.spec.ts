import { Test, TestingModule } from '@nestjs/testing';
import { BranchsController } from './branchs.controller';
import { BranchsService } from '../service/branchs.service';

describe('BranchsController', () => {
  let controller: BranchsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchsController],
      providers: [BranchsService],
    }).compile();

    controller = module.get<BranchsController>(BranchsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
