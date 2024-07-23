import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClanBoardsService } from './clan-boards.service';
import { CreateClanBoardDto } from './dto/create-clan-board.dto';
import { UpdateClanBoardDto } from './dto/update-clan-board.dto';

@Controller('clan-boards')
export class ClanBoardsController {
  constructor(private readonly clanBoardsService: ClanBoardsService) {}

  @Post()
  create(@Body() createClanBoardDto: CreateClanBoardDto) {
    return this.clanBoardsService.create(createClanBoardDto);
  }

  @Get()
  findAll() {
    return this.clanBoardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clanBoardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClanBoardDto: UpdateClanBoardDto) {
    return this.clanBoardsService.update(+id, updateClanBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clanBoardsService.remove(+id);
  }
}
