import { Module } from '@nestjs/common';
import { ClanPostsService } from './clan-posts.service';
import { ClanPostsController } from './clan-posts.controller';
import { S3Module } from 'src/s3/s3.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClanPost } from './entities/clan-post.entity';
import { ClanBoardsModule } from 'src/clan-boards/clan-boards.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClanPost]), S3Module, ClanBoardsModule],
  controllers: [ClanPostsController],
  providers: [ClanPostsService],
})
export class ClanPostsModule {}
