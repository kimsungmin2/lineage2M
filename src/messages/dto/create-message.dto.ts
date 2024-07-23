import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @ApiProperty({
    example: '1',
    description: '보낸 사람 ID',
  })
  sendUserId: number;

  @IsNumber()
  @ApiProperty({
    example: '2',
    description: '받는 사람 ID',
  })
  receiveUserId: number;

  @IsString()
  @ApiProperty({
    example: '안녕하세요',
    description: '쪽지 내용',
  })
  content: string;
}
