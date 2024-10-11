import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ParticipationEnum } from 'src/utils/type/participationEnum_type';

export class CreateBidDto {
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: '금액을 입력해주세요' })
  price: number;

  @IsEnum(ParticipationEnum, { message: '참여 여부를 선택해주세요' })
  @IsNotEmpty({ message: '참여 여부를 선택해주세요' })
  participation: ParticipationEnum;
}
