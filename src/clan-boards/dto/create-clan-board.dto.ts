import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateClanBoardDto {
  @IsString()
  @ApiProperty({
    example: 'Mint',
    description: '클랜 이름',
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: '잘 부탁 드립니다.',
    description: '클랜 한줄 소개',
  })
  content: string;

  @IsNumber()
  @ApiProperty({
    example: '1',
    description: '클랜 운영자 아이디',
  })
  masterId: number;

//   @IsNumber()
//   @ApiProperty({
//     example: '2',
//     description: '운영진 아이디',
//   })
//   managerId1: number;

//   @IsNumber()
//   @ApiProperty({
//     example: '3',
//     description: '운영진 아이디',
//   })
//   masagerId2: number;

//   @IsNumber()
//   @ApiProperty({
//     example: '4',
//     description: '운영진 아이디',
//   })
//   managerId3: number;
}
