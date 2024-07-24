import { Module } from '@nestjs/common';
import { ClanPostsService } from './clan-posts.service';
import { ClanPostsController } from './clan-posts.controller';

@Module({
  controllers: [ClanPostsController],
  providers: [ClanPostsService],
})
export class ClanPostsModule {}
