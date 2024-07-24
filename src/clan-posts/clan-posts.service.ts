import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClanPostDto } from './dto/create-clan-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClanPost } from './entities/clan-post.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';
import { ClanBoardsService } from 'src/clan-boards/clan-boards.service';
import { UpdateClanPostDto } from './dto/update-clan-post.dto';

@Injectable()
export class ClanPostsService {
  constructor(
    @InjectRepository(ClanPost)
    private clanPostRepository: Repository<ClanPost>,
    private readonly s3Service: S3Service,
    private readonly clanBoardService: ClanBoardsService,
  ) {}
  async createClanPost(
    clanId: number,
    userId: number,
    createClanPostDto: CreateClanPostDto,
    files: Express.Multer.File[],
  ) {
    try {
      let uploadResult: string[] = [];
      if (files.length !== 0) {
        const uploadResults: UploadResult[] =
          await this.s3Service.saveImages(files);
        for (let i = 0; i < uploadResults.length; i++) {
          uploadResult.push(uploadResults[i].imageUrl);
        }
      }
      const imageUrl =
        uploadResult.length > 0 ? JSON.stringify(uploadResult) : null;

      return await this.clanPostRepository.save({
        clanId,
        userId,
        ...createClanPostDto,
        imageUrl,
      });
    } catch (error) {}
  }

  async getManyClanPost() {
    try {
      return await this.clanPostRepository.find();
    } catch (error) {}
  }

  async updateClanPost(
    postId: number,
    userId: number,
    updateClanPostDto: UpdateClanPostDto,
  ) {
    try {
      const post = await this.getPostrById(postId);
      const manager = await this.clanBoardService.findByMaster(
        userId,
        post.clanId,
      );

      if (!manager || post.clanId !== manager.id) {
        throw new ForbiddenException();
      }

      return await this.clanPostRepository.update(postId, {
        ...updateClanPostDto,
      });
    } catch (error) {}
  }

  async getPostrById(postId: number) {
    try {
      const post = await this.clanPostRepository.findOne({
        where: { id: postId },
      });

      if (!post) {
        throw new NotFoundException();
      }
      return post;
    } catch (error) {}
  }

  async deleteClanPost(postId: number, userId: number) {
    try {
      const post = await this.getPostrById(postId);

      const manager = await this.clanBoardService.findByMaster(
        userId,
        post.clanId,
      );

      if (!manager || post.clanId !== manager.id) {
        throw new ForbiddenException();
      }

      return await this.clanPostRepository.softDelete({ id: postId });
    } catch (error) {}
  }
}
