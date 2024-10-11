import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Participation } from './entities/participation.entity';
import { Bid } from 'src/bid/entities/bid.entity';
import { ParticipationEnum } from 'src/utils/type/participationEnum_type';
import { BidService } from 'src/bid/bid.service';

@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(Participation)
    private readonly participationsRepository: Repository<Participation>,
    private readonly bidsRepository: Repository<Bid>,
    private readonly bidService: BidService,
  ) {}

  async findByParticipations(id: number) {
    const Participations = await this.participationsRepository.findOneBy({
      id,
    });

    const currentTime = new Date().getTime();

    if (Participations.deadLine > currentTime) {
      return Participations;
    } else {
      let topPrice = 0;
      let topName = '';
      let topBid = await this.bidsRepository.find({
        where: {
          participationId: id,
          participation: ParticipationEnum.participation,
        },
      });

      if (!topBid) {
        topBid = await this.bidsRepository.find({
          where: {
            participationId: id,
            participation: ParticipationEnum.notParticipation,
          },
        });
      }

      for (const row of topBid) {
        if (topPrice === 0) {
          topPrice = row.price;
          topName = row.name;
        } else {
          if (topPrice < row.price) {
            topPrice = row.price;
            topName = row.name;
          }
        }
      }

      return { topPrice, topName };
    }
  }

  async findAllParticipations() {
    const currentTime = new Date().getTime();
    const twoDaysAgo = currentTime - 2 * 19 * 60 * 60 * 1000;

    return await this.participationsRepository.find({
      where: {
        deadLine: MoreThanOrEqual(twoDaysAgo),
      },
    });
  }

  async createParticipations(
    id: number,
    boss: string,
    clearTime: Date,
    item: string,
  ) {
    const currentTime = new Date().getTime();
    const deadLine = currentTime + 1000 * 60 * 60;

    return await this.participationsRepository.save({
      id,
      boss,
      deadLine,
      clearTime,
      item,
    });
  }

  async createBid(
    participationId: number,
    name: string,
    price: number,
    participation: ParticipationEnum,
  ) {
    await this.bidService.getNameBid(participationId, name);

    const bid = await this.bidsRepository.find();

    if (!bid) {
      const participation = await this.participationsRepository.findOneBy({
        id: participationId,
      });
      if (participation) {
        await this.participationsRepository.update(participationId, {
          deadLine: participation.deadLine + 1000 * 60 * 60 * 7,
        });
      }
    }

    return await this.bidsRepository.save({
      participationId: participationId,
      name: name,
      price: price,
      participation: participation,
    });
  }
}
