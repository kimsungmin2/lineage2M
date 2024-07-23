import { Module } from '@nestjs/common';
import { ClanBoardsService } from './clan-boards.service';
import { ClanBoardsController } from './clan-boards.controller';

@Module({
  controllers: [ClanBoardsController],
  providers: [ClanBoardsService],
})
export class ClanBoardsModule {}
