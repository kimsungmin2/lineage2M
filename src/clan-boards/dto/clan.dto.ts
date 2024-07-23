import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ClanDto {
  @IsNumber()
  @ApiProperty({
    example: '1',
    description: '멤버 ID',
  })
  userId: number;

  @IsNumber()
  @ApiProperty({
    example: '2',
    description: '클랜 ID',
  })
  clanId: number;
}
