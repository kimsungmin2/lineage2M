import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ParticipationEnum } from 'src/utils/type/participationEnum_type';

export class CreateBidDto {
  name: string;

  price: number;

  participation: number;
}
