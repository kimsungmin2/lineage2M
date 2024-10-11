import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Participation } from './entities/participation.entity';
import { Bid } from 'src/bid/entities/bid.entity';
import { BidService } from 'src/bid/bid.service';

@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(Participation)
    private readonly participationsRepository: Repository<Participation>,
    @InjectRepository(Bid)
    private readonly bidsRepository: Repository<Bid>,
    private readonly bidService: BidService,
  ) {}

  async findByParticipations(id: number) {
    try {
      let Participations = await this.participationsRepository.findOneBy({
        id,
      });

      if (!Participations) {
        throw new Error('Participation not found');
      }

      Participations.deadLine = Math.floor(Participations.deadLine / 1000);
      const currentTime = Math.floor(new Date().getTime() / 1000);

      if (Participations.deadLine > currentTime) {
        return Participations;
      } else {
        let topPrice = 0;
        let topName = '';
        let topBidStatus = 0;
        let topBid = await this.bidsRepository.find({
          where: {
            participationId: id,
            participation: 0,
          },
        });

        if (!topBid || topBid.length === 0) {
          if (Participations.check === 0) {
            await this.participationsRepository.update(id, {
              deadLine: Participations.deadLine * 1000 + 1000 * 60 * 60 * 7,
              check: 1,
            });
          }

          topBid = await this.bidsRepository.find({
            where: {
              participationId: id,
              participation: 1,
            },
          });
        }

        for (const row of topBid) {
          if (topPrice === 0) {
            topPrice = row.price;
            topName = row.name;
            topBidStatus = row.participation;
          } else {
            if (topPrice < row.price) {
              topPrice = row.price;
              topName = row.name;
            }
          }
        }

        // 새로운 객체를 생성하여 반환
        return {
          ...Participations,
          topPrice,
          topName,
          topBidStatus,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async findAllParticipations() {
    try {
      const currentTime = new Date().getTime();
      const twoDaysAgo = currentTime - 2 * 19 * 60 * 60 * 1000;

      return await this.participationsRepository.find({
        where: {
          deadLine: MoreThanOrEqual(twoDaysAgo),
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createParticipations(boss: string, clearTime: Date, item: string) {
    try {
      const currentTime = new Date().getTime();
      const deadLine = currentTime + 1000 * 60 * 60;

      return await this.participationsRepository.save({
        boss,
        deadLine,
        clearTime,
        item,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createBid(
    participationId: number,
    name: string,
    price: number,
    participation: number,
  ) {
    try {
      const deadLine = await this.participationsRepository.findOneBy({
        id: participationId,
      });
      const currentTime = new Date().getTime();
      if (deadLine.deadLine < currentTime) {
        throw new UnauthorizedException();
      }
      await this.bidService.getNameBid(participationId, name);

      return await this.bidsRepository.save({
        participationId: participationId,
        name: name,
        price: price,
        participation: participation,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
