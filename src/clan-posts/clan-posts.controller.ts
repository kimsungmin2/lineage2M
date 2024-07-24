import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { ClanPostsService } from './clan-posts.service';
import { CreateClanPostDto } from './dto/create-clan-post.dto';
import { UpdateClanPostDto } from './dto/update-clan-post.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('clan')
@UseGuards()
@Controller('clan-posts')
export class ClanPostsController {
  constructor(private readonly clanPostsService: ClanPostsService) {}

  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '클랜 게시글 생성' })
  @UseInterceptors(FileInterceptor('imageUrl'))
  @Post('create')
  async createClan(
    @Body() createClanPostDto: CreateClanPostDto,
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { userId, clanId } = req.user;

    const post = await this.clanPostsService.createClanPost(
      clanId,
      userId,
      createClanPostDto,
      files,
    );

    return post;
  }

  @ApiOperation({ summary: '클랜 홍보 게시글 조회' })
  @Get('')
  async getManyClanPost() {
    return await this.clanPostsService.getManyClanPost();
  }

  @ApiOperation({ summary: '클랜 게시글 업데이트' })
  @Patch(':postId')
  async updateClanPost(
    @Param('postId') postId: number,
    @Body() updateClanPostDto: UpdateClanPostDto,
    @Req() req,
  ) {
    const { userId } = req.user;
    return await this.clanPostsService.updateClanPost(
      postId,
      userId,
      updateClanPostDto,
    );
  }

  @ApiOperation({ summary: '클랜 게시글 삭제' })
  @Delete(':postId')
  async deleteClanPost(@Param('postId') postId: number, @Req() req) {
    const { userId } = req.user;

    return await this.clanPostsService.deleteClanPost(postId, userId);
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @Get(':postId')
  async getPostrById(@Param('postId') postId: number) {
    return await this.clanPostsService.getPostrById(postId);
  }
}
