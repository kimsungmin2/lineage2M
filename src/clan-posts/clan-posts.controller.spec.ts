import { Test, TestingModule } from '@nestjs/testing';
import { ClanPostsController } from './clan-posts.controller';
import { ClanPostsService } from './clan-posts.service';

describe('ClanPostsController', () => {
  let controller: ClanPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClanPostsController],
      providers: [ClanPostsService],
    }).compile();

    controller = module.get<ClanPostsController>(ClanPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
