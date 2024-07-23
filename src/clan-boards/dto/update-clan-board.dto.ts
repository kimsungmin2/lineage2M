import { PartialType } from '@nestjs/mapped-types';
import { CreateClanBoardDto } from './create-clan-board.dto';

export class UpdateClanBoardDto extends PartialType(CreateClanBoardDto) {}
