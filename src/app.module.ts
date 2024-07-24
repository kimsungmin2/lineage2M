import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ClanBoards } from './clan-boards/entities/clan-board.entity';
import { ClanPost } from './clan-posts/entities/clan-post.entity';
import { Message } from './messages/entities/message.entity';
import { S3Module } from './s3/s3.module';
import { ClanPostsModule } from './clan-posts/clan-posts.module';
import { ClanBoardsModule } from './clan-boards/clan-boards.module';
import { MessagesModule } from './messages/messages.module';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [ClanBoards, ClanPost, Message],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    S3Module,
    ClanPostsModule,
    ClanBoardsModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
