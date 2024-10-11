import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidsRepository: Repository<Bid>,
  ) {}

  async getNameBid(participationId: number, name: string) {
    try {
      const existingName = await this.bidsRepository.findOne({
        where: {
          participationId,
          name,
        },
      });
      if (existingName) {
        throw new ConflictException('중복된 입찰 입니다.');
      }
    } catch (error) {
      throw new ConflictException('중복된 입찰 입니다.');
    }
  }
}
