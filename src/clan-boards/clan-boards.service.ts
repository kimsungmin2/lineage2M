import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ClanBoards } from './entities/clan-board.entity';
import { S3Service } from '../s3/s3.service';
import { CreateClanBoardDto } from './dto/create-clan-board.dto';
import { ClanUsers } from './entities/clanUsers.entity';
import { GetClan } from './types/getClan.type';
import { UpadteClanDto } from './dto/update-clan-board.dto';
import { ClanDto } from './dto/clan.dto';
import { ClanJoin } from './types/clanJoin.type';
import { MasterDto } from './dto/master.dto';

@Injectable()
export class ClanBoardsService {
  constructor(
    @InjectRepository(ClanBoards)
    private clanBoardsRepository: Repository<ClanBoards>,
    private s3Service: S3Service,
    private readonly dataSource: DataSource,
    @InjectRepository(ClanUsers)
    private clanUsersRepository: Repository<ClanUsers>,
  ) {}

  async createClan(
    createClanBoardDto: CreateClanBoardDto,
    files: Express.Multer.File[],
  ) {
    try {
      const { name, content, masterId } = createClanBoardDto;

      await this.findByClan(masterId);

      let uploadResult: string[] = [];
      if (files.length !== 0) {
        const uploadResults: UploadResult[] =
          await this.s3Service.saveImages(files);
        for (let i = 0; i < uploadResults.length; i++) {
          uploadResult.push(uploadResults[i].imageUrl);
        }
      }
      const imageUrl =
        uploadResult.length > 0 ? JSON.stringify(uploadResult) : null;

      const clan = await this.clanBoardsRepository.save({
        name,
        content,
        masterId,
        logo: imageUrl,
      });

      return clan;
    } catch (error) {
      console.log(error);
    }
  }

  async createClanUsers(clanId: number, clanDto: ClanDto) {
    try {
      await this.findByClan(clanId);

      return await this.clanUsersRepository.save({
        clanId,
        userId: clanDto.userId,
        status: ClanJoin.no,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findClanAndUser(clanId: number, userId: number) {
    const userClan = await this.clanUsersRepository.findOne({
      where: {
        userId,
        clanId,
      },
    });
    if (!userClan) {
      throw new NotFoundException();
    }
    return userClan;
  }

  async createClanJoin(clanId: number, userId: number) {
    //유저 있는지 체크
    await this.findByClan(clanId);

    const userClan = await this.findClanAndUser(clanId, userId);
    if (userClan.status === ClanJoin.yes) {
      throw new ConflictException();
    }

    userClan.status = ClanJoin.yes;
    await this.clanUsersRepository.save(userClan);

    return userClan;
  }

  async findManyClan(type: number) {
    try {
      let results;

      if (type === GetClan.all) {
        results = await this.clanUsersRepository
          .createQueryBuilder('clanUsers')
          .select('clanUsers.clanId', 'clanId')
          .addSelect('COUNT(clanUsers.id)', 'clanUsersCount')
          .groupBy('clanUsers.clanId')
          .orderBy('clanUsersCount', 'DESC')
          .getRawMany();
      } else if (type === GetClan.days30) {
        const date30DaysAgo = new Date();
        date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

        results = await this.clanUsersRepository
          .createQueryBuilder('clanUsers')
          .select('clanUsers.clanId', 'clanId')
          .addSelect('COUNT(clanUsers.id)', 'clanUsersCount')
          .where('clanUsers.createdAt >= :date', { date: date30DaysAgo })
          .groupBy('clanUsers.clanId')
          .orderBy('clanUsersCount', 'DESC')
          .getRawMany();
      }

      return results;
    } catch (error) {
      console.log(error);
    }
  }

  async findByClan(clanId: number) {
    try {
      const clan = await this.clanBoardsRepository.findOne({
        where: {
          id: clanId,
        },
      });
      if (!clan) {
        throw new NotFoundException();
      }

      return clan;
    } catch (error) {
      console.log(error);
    }
  }

  async findByMaster(clanId: number, userId: number) {
    try {
      const clan = await this.clanBoardsRepository.findOne({
        where: [
          { id: clanId, masterId: userId },
          { id: clanId, managerId1: userId },
          { id: clanId, managerId2: userId },
          { id: clanId, managerId3: userId },
        ],
      });

      return clan;
    } catch (error) {
      console.log(error);
    }
  }

  async updateClan(clanId: number, updateClanDto: UpadteClanDto) {
    try {
      const managerIds = [
        updateClanDto.masterId,
        updateClanDto.managerId1,
        updateClanDto.managerId2,
        updateClanDto.managerId3,
      ];

      for (const managerId of managerIds) {
        const clan = await this.findByMaster(clanId, managerId);
        if (clan) {
          throw new ConflictException('하나의 클랜만 운영 가능합니다.');
        }
      }
      return await this.clanBoardsRepository.save({
        id: clanId,
        ...updateClanDto,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateClanMaster(clanId: number, masterDto: MasterDto) {
    await this.findClanAndUser(clanId, masterDto.userId);

    return await this.clanBoardsRepository.update(clanId, {
      masterId: masterDto.userId,
    });
  }

  async deleteClan(clanDto: ClanDto) {
    try {
      const clan = await this.findByClan(clanDto.clanId);
      if (!clan) {
        throw new NotFoundException();
      }

      if (clan.masterId !== clanDto.userId) {
        throw new ForbiddenException();
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager
          .getRepository(ClanUsers)
          .softDelete({ id: clanDto.clanId });

        await queryRunner.manager
          .getRepository(ClanUsers)
          .softDelete({ clanId: clanDto.clanId });
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteClanUser(clanDto: ClanDto) {
    try {
      const users = await this.clanUsersRepository.softDelete({
        userId: clanDto.userId,
        clanId: clanDto.clanId,
      });

      if (!users) {
        throw new NotFoundException();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async outClanUser(clanId: number, userId: number) {
    return await this.clanUsersRepository.softDelete({ clanId, userId });
  }
}
