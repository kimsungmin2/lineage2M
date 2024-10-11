import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [BidController],
  imports: [TypeOrmModule.forFeature([Bid])],
  providers: [BidService],
  exports: [BidService],
})
export class BidModule {}
