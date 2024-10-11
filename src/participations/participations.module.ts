import { Module } from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { ParticipationsController } from './participations.controller';
import { BidModule } from 'src/bid/bid.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from './entities/participation.entity';
import { Bid } from 'src/bid/entities/bid.entity';

@Module({
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
  imports: [BidModule, TypeOrmModule.forFeature([Participation, Bid])],
})
export class ParticipationsModule {}
