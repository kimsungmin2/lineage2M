import { Injectable } from '@nestjs/common';
import { CreateClanBoardDto } from './dto/create-clan-board.dto';
import { UpdateClanBoardDto } from './dto/update-clan-board.dto';

@Injectable()
export class ClanBoardsService {
  create(createClanBoardDto: CreateClanBoardDto) {
    return 'This action adds a new clanBoard';
  }

  findAll() {
    return `This action returns all clanBoards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clanBoard`;
  }

  update(id: number, updateClanBoardDto: UpdateClanBoardDto) {
    return `This action updates a #${id} clanBoard`;
  }

  remove(id: number) {
    return `This action removes a #${id} clanBoard`;
  }
}
