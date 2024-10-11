import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateParticipationDto {
  @IsString()
  @IsNotEmpty({ message: '보스 이름을 입력해주세요.' })
  boss: string;

  @IsString()
  @IsNotEmpty({ message: '아이템 이름을 입력해주세요' })
  item: string;

  @IsNotEmpty({ message: '클리어 시간을 입력해주세요' })
  clearTime: Date;
}
