import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipationsModule } from './participations/participations.module';
import { BidModule } from './bid/bid.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ParticipationsModule, BidModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
