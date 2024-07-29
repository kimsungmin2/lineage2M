import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateClanDiscord {
  @IsString()
  @ApiProperty({
    example: 'ASK123AXK',
    description: '클랜 디스코드',
  })
  clanDisCord: string;
}
