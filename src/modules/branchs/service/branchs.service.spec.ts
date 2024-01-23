import { Test, TestingModule } from '@nestjs/testing';
import { BranchsService } from './branchs.service';

describe('BranchsService', () => {
  let service: BranchsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BranchsService],
    }).compile();

    service = module.get<BranchsService>(BranchsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
