import { Test, TestingModule } from '@nestjs/testing';
import { ClanPostsService } from './clan-posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClanPost } from './entities/clan-post.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';
import { ClanBoardsService } from 'src/clan-boards/clan-boards.service';
import { CreateClanPostDto } from './dto/create-clan-post.dto';
import { UpdateClanPostDto } from './dto/update-clan-post.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

jest.mock('src/s3/s3.service');
jest.mock('src/clan-boards/clan-boards.service');

describe('ClanPostsService', () => {
  let service: ClanPostsService;
  let clanPostRepository: jest.Mocked<Repository<ClanPost>>;
  let s3Service: jest.Mocked<S3Service>;
  let clanBoardService: jest.Mocked<ClanBoardsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClanPostsService,
        {
          provide: getRepositoryToken(ClanPost),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: {
            saveImages: jest.fn(),
          },
        },
        {
          provide: ClanBoardsService,
          useValue: {
            findByMaster: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClanPostsService>(ClanPostsService);
    clanPostRepository = module.get(getRepositoryToken(ClanPost));
    s3Service = module.get(S3Service);
    clanBoardService = module.get(ClanBoardsService);
  });

  describe('createClanPost', () => {
    it('클랜 게시글 생성', async () => {
      const clanId = 1;
      const userId = 1;
      const createClanPostDto: CreateClanPostDto = {
        title: 'Mint 클랜입니다.',
        content: '마스터 이상 가입 가능합니다.',
      };
      const files: Express.Multer.File[] = [];
      const mockPost = {
        id: 1,
        ...createClanPostDto,
        clanId,
        userId,
        imageUrl: null,
      };

      (clanPostRepository.save as jest.Mock).mockResolvedValue(mockPost);

      const result = await service.createClanPost(
        clanId,
        userId,
        createClanPostDto,
        files,
      );

      expect(result).toEqual(mockPost);
    });
  });

  describe('getManyClanPost', () => {
    it('클랜 게시글 전체 조회', async () => {
      const mockPosts = [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' },
      ];

      (clanPostRepository.find as jest.Mock).mockResolvedValue(mockPosts);

      const result = await service.getManyClanPost();

      expect(result).toEqual(mockPosts);
    });
  });

  describe('updateClanPost', () => {
    it('클랜 게시글 업데이트', async () => {
      const postId = 1;
      const userId = 1;
      const updateClanPostDto: UpdateClanPostDto = {
        title: 'Mint 클랜입니다.',
        content: '그마 이상 받습니다.',
      };
      const mockPost = { id: postId, clanId: 1, userId };

      (service.getPostrById as jest.Mock).mockResolvedValue(mockPost);
      (clanBoardService.findByMaster as jest.Mock).mockResolvedValue(mockPost);
      (clanPostRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      const result = await service.updateClanPost(
        postId,
        userId,
        updateClanPostDto,
      );

      expect(result).toEqual({ affected: 1 });
    });

    it('운영진이 아닐 경우', async () => {
      const postId = 1;
      const userId = 1;
      const updateClanPostDto: UpdateClanPostDto = {
        title: 'Mint 클랜입니다.',
        content: '그마 이상 받습니다.',
      };
      const mockPost = { id: postId, clanId: 1, userId };

      (service.getPostrById as jest.Mock).mockResolvedValue(mockPost);
      (clanBoardService.findByMaster as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateClanPost(postId, userId, updateClanPostDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getPostrById', () => {
    it('클랜 게시글 상세 조회', async () => {
      const postId = 1;
      const mockPost = { id: postId, title: 'Post 1', content: 'Content 1' };

      (clanPostRepository.findOne as jest.Mock).mockResolvedValue(mockPost);

      const result = await service.getPostrById(postId);

      expect(result).toEqual(mockPost);
    });

    it('존재하지 않는 클랜 게시글일 경우', async () => {
      const postId = 1;

      (clanPostRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getPostrById(postId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteClanPost', () => {
    it('게시글 삭제 성공', async () => {
      const postId = 1;
      const userId = 1;
      const mockPost = { id: postId, clanId: 1, userId };

      (service.getPostrById as jest.Mock).mockResolvedValue(mockPost);
      (clanBoardService.findByMaster as jest.Mock).mockResolvedValue(mockPost);
      (clanPostRepository.softDelete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      const result = await service.deleteClanPost(postId, userId);

      expect(result).toEqual({ affected: 1 });
    });

    it('운영진이 아닐 경우', async () => {
      const postId = 1;
      const userId = 1;
      const mockPost = { id: postId, clanId: 1, userId };

      (service.getPostrById as jest.Mock).mockResolvedValue(mockPost);
      (clanBoardService.findByMaster as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteClanPost(postId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
