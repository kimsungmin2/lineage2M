import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClanBoardsModule } from './clan-boards/clan-boards.module';

@Module({
  imports: [ClanBoardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
