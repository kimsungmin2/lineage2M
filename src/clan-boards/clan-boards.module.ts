import { Module } from '@nestjs/common';
import { ClanBoardsService } from './clan-boards.service';
import { ClanBoardsController } from './clan-boards.controller';
import { S3Module } from 'src/s3/s3.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClanUsers } from './entities/clanUsers.entity';
import { ClanBoards } from './entities/clan-board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClanUsers, ClanBoards]), S3Module],
  controllers: [ClanBoardsController],
  providers: [ClanBoardsService],
  exports: [ClanBoardsService]
})
export class ClanBoardsModule { }
