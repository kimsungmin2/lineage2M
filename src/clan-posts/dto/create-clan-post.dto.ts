import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateClanPostDto {
  @IsString()
  @ApiProperty({
    example: 'Mint 클랜입니다.',
    description: '제목',
  })
  title: string;

  @IsString()
  @ApiProperty({
    example: '롤 티어 마스터 이상 구합니다.',
    description: '내용',
  })
  content: string;
}
