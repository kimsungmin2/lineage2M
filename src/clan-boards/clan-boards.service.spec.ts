import { Test, TestingModule } from '@nestjs/testing';
import { ClanBoardsService } from './clan-boards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClanBoards } from './entities/clan-board.entity';
import { S3Service } from '../s3/s3.service';
import { DataSource, Repository } from 'typeorm';
import { ClanUsers } from './entities/clanUsers.entity';
import { CreateClanBoardDto } from './dto/create-clan-board.dto';
import { ClanDto } from './dto/clan.dto';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { GetClan } from './types/getClan.type';
import { UpadteClanDto } from './dto/update-clan-board.dto';
import { MasterDto } from './dto/master.dto';

jest.mock('../s3/s3.service');

describe('ClanBoardsService', () => {
  let service: ClanBoardsService;
  let clanBoardsRepository: jest.Mocked<Repository<ClanBoards>>;
  let clanUsersRepository: jest.Mocked<Repository<ClanUsers>>;
  let s3Service: jest.Mocked<S3Service>;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClanBoardsService,
        {
          provide: getRepositoryToken(ClanBoards),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ClanUsers),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            softDelete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getRawMany: jest.fn(),
            }),
          },
        },
        {
          provide: S3Service,
          useValue: {
            saveImages: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                getRepository: jest.fn().mockReturnValue({
                  softDelete: jest.fn(),
                }),
              },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ClanBoardsService>(ClanBoardsService);
    clanBoardsRepository = module.get(getRepositoryToken(ClanBoards));
    clanUsersRepository = module.get(getRepositoryToken(ClanUsers));
    s3Service = module.get(S3Service);
    dataSource = module.get(DataSource);
  });

  describe('createClan', () => {
    it('클랜 생성', async () => {
      const createClanBoardDto: CreateClanBoardDto = {
        name: 'Mint Clan',
        content: '마스터 이상만',
        masterId: 1,
      };
      const files: Express.Multer.File[] = [];

      (service.findByClan as jest.Mock).mockResolvedValue({});
      (clanBoardsRepository.save as jest.Mock).mockResolvedValue({
        id: 1,
        ...createClanBoardDto,
        logo: null,
      });

      const result = await service.createClan(createClanBoardDto, files);

      expect(result).toEqual({
        id: 1,
        ...createClanBoardDto,
        logo: null,
      });
    });
  });

  describe('createClanUsers', () => {
    it('클랜에 유저 가입 신청', async () => {
      const clanDto: ClanDto = {
        userId: 1,
        clanId: 1,
      };

      (service.findByClan as jest.Mock).mockResolvedValue({});
      (clanUsersRepository.save as jest.Mock).mockResolvedValue({
        id: 1,
        ...clanDto,
        status: 'no',
      });

      const result = await service.createClanUsers(clanDto.clanId, clanDto);

      expect(result).toEqual({
        id: 1,
        ...clanDto,
        status: 'no',
      });
    });
  });

  describe('findClanAndUser', () => {
    it('클랜에 가입해있는지 확인', async () => {
      const clanId = 1;
      const userId = 1;

      (clanUsersRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        clanId,
        userId,
        status: 'yes',
      });

      const result = await service.findClanAndUser(clanId, userId);

      expect(result).toEqual({
        id: 1,
        clanId,
        userId,
        status: 'yes',
      });
    });

    it('신청 하지 않았을 경우', async () => {
      const clanId = 1;
      const userId = 1;

      (clanUsersRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findClanAndUser(clanId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createClanJoin', () => {
    it('클랜 가입 승인', async () => {
      const clanId = 1;
      const userId = 1;

      (service.findByClan as jest.Mock).mockResolvedValue({});
      (service.findClanAndUser as jest.Mock).mockResolvedValue({
        id: 1,
        clanId,
        userId,
        status: 'no',
      });
      (clanUsersRepository.save as jest.Mock).mockResolvedValue({
        id: 1,
        clanId,
        userId,
        status: 'yes',
      });

      const result = await service.createClanJoin(clanId, userId);

      expect(result).toEqual({
        id: 1,
        clanId,
        userId,
        status: 'yes',
      });
    });

    it('이미 가입한 유저', async () => {
      const clanId = 1;
      const userId = 1;

      (service.findByClan as jest.Mock).mockResolvedValue({});
      (service.findClanAndUser as jest.Mock).mockResolvedValue({
        id: 1,
        clanId,
        userId,
        status: 'yes',
      });

      await expect(service.createClanJoin(clanId, userId)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findManyClan', () => {
    it('전체 클랜 인원수 랭킹', async () => {
      const mockResult = [
        { clanId: 1, clanUsersCount: 10 },
        { clanId: 2, clanUsersCount: 8 },
      ];

      (clanUsersRepository.createQueryBuilder as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await service.findManyClan(GetClan.all);

      expect(result).toEqual(mockResult);
    });

    it('최근 30일 이내 가입한 유저 랭킹', async () => {
      const mockResult = [
        { clanId: 1, clanUsersCount: 5 },
        { clanId: 2, clanUsersCount: 3 },
      ];

      (clanUsersRepository.createQueryBuilder as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await service.findManyClan(GetClan.days30);

      expect(result).toEqual(mockResult);
    });
  });
  describe('findByClan', () => {
    it('클랜 상세 검색', async () => {
      const clanId = 1;
      const mockClan = { id: clanId };

      (clanBoardsRepository.findOne as jest.Mock).mockResolvedValue(mockClan);

      const result = await service.findByClan(clanId);

      expect(result).toEqual(mockClan);
    });

    it('존재 하지 않는 클랜ID', async () => {
      const clanId = 1;

      (clanBoardsRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findByClan(clanId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByMaster', () => {
    it('클랜 운영진 확인이 됐을 때', async () => {
      const clanId = 1;
      const userId = 1;
      const mockClan = { id: clanId, masterId: userId };

      (clanBoardsRepository.findOne as jest.Mock).mockResolvedValue(mockClan);

      const result = await service.findByMaster(clanId, userId);

      expect(result).toEqual(mockClan);
    });

    it('클랜 운영진이 아닐 때', async () => {
      const clanId = 1;
      const userId = 1;

      (clanBoardsRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findByMaster(clanId, userId);

      expect(result).toBeNull();
    });
  });

  describe('updateClan', () => {
    it('클랜 업데이트', async () => {
      const clanId = 1;
      const updateClanDto: UpadteClanDto = {
        masterId: 1,
        managerId1: 2,
        managerId2: 3,
        managerId3: 4,
        name: 'Mint Clan',
        content: '그마 이상만~',
      };

      (service.findByMaster as jest.Mock).mockResolvedValue(null);
      (clanBoardsRepository.save as jest.Mock).mockResolvedValue({
        id: clanId,
        ...updateClanDto,
      });

      const result = await service.updateClan(clanId, updateClanDto);

      expect(result).toEqual({
        id: clanId,
        ...updateClanDto,
      });
    });

    it('운영진이 이미 다른 클랜의 소속일 때', async () => {
      const clanId = 1;
      const updateClanDto: UpadteClanDto = {
        masterId: 1,
        managerId1: 2,
        managerId2: 3,
        managerId3: 4,
        name: 'Mint Clan',
        content: '마스터 이상만',
      };

      (service.findByMaster as jest.Mock).mockResolvedValue({});

      await expect(service.updateClan(clanId, updateClanDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateClanMaster', () => {
    it('클랜장 승격', async () => {
      const clanId = 1;
      const masterDto: MasterDto = { userId: 2 };

      (service.findClanAndUser as jest.Mock).mockResolvedValue({});
      (clanBoardsRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      const result = await service.updateClanMaster(clanId, masterDto);

      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('deleteClan', () => {
    it('클랜 삭제 성공', async () => {
      const clanDto: ClanDto = { userId: 1, clanId: 1 };

      (service.findByClan as jest.Mock).mockResolvedValue({ masterId: 1 });

      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.manager
        .getRepository(ClanUsers)
        .softDelete({ id: clanDto.clanId });
      await queryRunner.manager
        .getRepository(ClanUsers)
        .softDelete({ clanId: clanDto.clanId });

      const result = await service.deleteClan(clanDto);

      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('삭제하려는 클랜 ID가 없을 시', async () => {
      const clanDto: ClanDto = { userId: 1, clanId: 1 };

      (service.findByClan as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteClan(clanDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('마스터가 아닐 경우 삭제 불가', async () => {
      const clanDto: ClanDto = { userId: 2, clanId: 1 };

      (service.findByClan as jest.Mock).mockResolvedValue({ masterId: 1 });

      await expect(service.deleteClan(clanDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('deleteClanUser', () => {
    it('클랜 탈퇴 완료', async () => {
      const clanDto: ClanDto = { userId: 1, clanId: 1 };

      (clanUsersRepository.softDelete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      const result = await service.deleteClanUser(clanDto);

      expect(result).toEqual({ affected: 1 });
    });

    it('이미 탈퇴 되었거나 정보가 없을 경우', async () => {
      const clanDto: ClanDto = { userId: 1, clanId: 1 };

      (clanUsersRepository.softDelete as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      await expect(service.deleteClanUser(clanDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('outClanUser', () => {
    it('클랜 추방', async () => {
      const clanId = 1;
      const userId = 1;

      (clanUsersRepository.softDelete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      const result = await service.outClanUser(clanId, userId);

      expect(result).toEqual({ affected: 1 });
    });
  });
});
