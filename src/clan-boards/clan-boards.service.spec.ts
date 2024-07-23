import { Test, TestingModule } from '@nestjs/testing';
import { ClanBoardsService } from './clan-boards.service';

describe('ClanBoardsService', () => {
  let service: ClanBoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClanBoardsService],
    }).compile();

    service = module.get<ClanBoardsService>(ClanBoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
