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
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ClanBoardsService } from './clan-boards.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateClanBoardDto } from './dto/create-clan-board.dto';
import { ClanDto } from './dto/clan.dto';
import { UpadteClanDto } from './dto/update-clan-board.dto';
import { MasterDto } from './dto/master.dto';

@ApiTags('clan')
@UseGuards()
@Controller('clan-boards')
export class ClanBoardsController {
  constructor(private readonly clanBoardsService: ClanBoardsService) {}

  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '클랜 생성' })
  @UseInterceptors(FileInterceptor('logo'))
  @Post('create')
  async createClan(
    @Body() createClanBoardDto: CreateClanBoardDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const clan = await this.clanBoardsService.createClan(
      createClanBoardDto,
      file,
    );

    return clan;
  }

  @ApiOperation({ summary: '클랜 가입 신청' })
  @Post(':clanId/')
  async createClanUser(@Param('clanId') clanId: number, clanDto: ClanDto) {
    return await this.clanBoardsService.createClanUsers(clanId, clanDto);
  }

  //가드 달아놔야됨
  @ApiOperation({ summary: '클랜 가입 수락' })
  @Patch(':clanId/join/:userId')
  async createClanJoin(
    @Param('clanId') clanId: number,
    @Param('userId') userId: number,
  ) {
    return await this.createClanJoin(clanId, userId);
  }

  @ApiOperation({ summary: '클랜 찾기' })
  @Get('')
  async findManyClan(@Query('type') type: number) {
    return await this.clanBoardsService.findManyClan(type);
  }

  @ApiOperation({ summary: '클랜 정보' })
  @Get(':clanId')
  async findByClan(@Param('clanId') clanId: number) {
    return await this.clanBoardsService.findByClan(clanId);
  }

  @ApiOperation({ summary: '클랜 정보 수정' })
  @Patch(':clanId')
  async updateClan(clanId: number, upadteClanDto: UpadteClanDto) {
    return await this.clanBoardsService.updateClan(clanId, upadteClanDto);
  }

  @ApiOperation({ summary: '클랜장 양도' })
  @Patch(':clanId/transfer')
  async updateClanMaster(
    @Param('clanId') clanId: number,
    masterDto: MasterDto,
  ) {
    return await this.clanBoardsService.updateClanMaster(clanId, masterDto);
  }

  //가드 만들기 전까지 못 씀 임시로 클랜 디티오
  @ApiOperation({ summary: '클랜 삭제' })
  @Delete(':clanId/delete')
  async deleteClan(@Param('clanId') clanId: number, clanDto: ClanDto) {
    return await this.clanBoardsService.deleteClan(clanDto);
  }

  //가드 만들기 전까지 못 씀 임시로 클랜 디티오
  @ApiOperation({ summary: '클랜 탈퇴' })
  @Delete(':clanId/withdrawal')
  async deleteClanUser(@Param('clanId') clanId: number, clanDto: ClanDto) {
    return await this.clanBoardsService.deleteClanUser(clanDto);
  }

  @ApiOperation({ summary: '클랜원 추방' })
  @Delete(':clanId/getOut/:userId')
  async outClanUser(
    @Param('clanId') clanId: number,
    @Param('clauserIdnId') userId: number,
  ) {
    return await this.clanBoardsService.outClanUser(clanId, userId);
  }
}
