import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class MasterDto {
  @IsNumber()
  @ApiProperty({
    example: '1',
    description: '바꿀 Master ID',
  })
  userId: number;
}
