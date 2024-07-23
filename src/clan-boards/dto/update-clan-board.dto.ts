import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CreateClanBoardDto } from './create-clan-board.dto';

export class UpadteClanDto extends PickType(CreateClanBoardDto, [
  'content',
  'masterId',
  'name',
] as const) {
  @IsNumber()
  @ApiProperty({
    example: '2',
    description: '운영진 아이디',
  })
  managerId1: number;

  @IsNumber()
  @ApiProperty({
    example: '3',
    description: '운영진 아이디',
  })
  masagerId2: number;

  @IsNumber()
  @ApiProperty({
    example: '4',
    description: '운영진 아이디',
  })
  managerId3: number;
}
