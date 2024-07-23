import { Module } from '@nestjs/common';
import { ClanBoardsService } from './clan-boards.service';
import { ClanBoardsController } from './clan-boards.controller';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [ClanBoardsController],
  providers: [ClanBoardsService],
})
export class ClanBoardsModule {}
