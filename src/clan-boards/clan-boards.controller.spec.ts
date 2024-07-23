import { Test, TestingModule } from '@nestjs/testing';
import { ClanBoardsController } from './clan-boards.controller';
import { ClanBoardsService } from './clan-boards.service';

describe('ClanBoardsController', () => {
  let controller: ClanBoardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClanBoardsController],
      providers: [ClanBoardsService],
    }).compile();

    controller = module.get<ClanBoardsController>(ClanBoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
