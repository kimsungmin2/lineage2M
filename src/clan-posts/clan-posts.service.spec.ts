import { Test, TestingModule } from '@nestjs/testing';
import { ClanPostsService } from './clan-posts.service';

describe('ClanPostsService', () => {
  let service: ClanPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClanPostsService],
    }).compile();

    service = module.get<ClanPostsService>(ClanPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
