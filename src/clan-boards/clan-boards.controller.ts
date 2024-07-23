import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClanBoardsService } from './clan-boards.service';

@Controller('clan-boards')
export class ClanBoardsController {
  constructor(private readonly clanBoardsService: ClanBoardsService) {}
}
