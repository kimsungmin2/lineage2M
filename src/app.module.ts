import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClanBoardsModule } from './clan-boards/clan-boards.module';
import { S3Module } from './s3/s3.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [ClanBoardsModule, S3Module, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
