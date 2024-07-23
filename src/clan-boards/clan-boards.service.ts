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
    file: Express.Multer.File,
  ) {
    try {
      const { name, content, masterId } = createClanBoardDto;

      await this.findByClan(masterId);

      const imageName = this.s3Service.getUUID();
      const ext = file.originalname.split('.').pop();
      const imageUrl = await this.s3Service.imageUploadToS3(
        `${imageName}.${ext}`,
        file,
        ext,
      );

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

  async createClanUsers(clanDto: ClanDto) {
    try {
      return await this.clanUsersRepository.save({ ...clanDto });
    } catch (error) {
      console.log(error);
    }
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

      return clan;
    } catch (error) {
      console.log(error);
    }
  }

  async findByMaster(userId: number) {
    try {
      const clan = await this.clanBoardsRepository.findOne({
        where: [
          { masterId: userId },
          { managerId1: userId },
          { managerId2: userId },
          { managerId3: userId },
        ],
      });
      if (clan) {
        throw new ConflictException('하나의 클랜만 운영 가능합니다.');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateClan(clanId: number, updateClanDto: UpadteClanDto) {
    try {
      return await this.clanBoardsRepository.save({
        id: clanId,
        ...updateClanDto,
      });
    } catch (error) {
      console.log(error);
    }
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
          .delete({ id: clanDto.clanId });

        await queryRunner.manager
          .getRepository(ClanUsers)
          .delete({ clanId: clanDto.clanId });
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
      const users = await this.clanUsersRepository.delete({
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
}
