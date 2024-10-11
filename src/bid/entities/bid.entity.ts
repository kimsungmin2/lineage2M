import { ParticipationEnum } from 'src/utils/type/participationEnum_type';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'enum', enum: ParticipationEnum })
  participation: ParticipationEnum;

  @Column({ type: 'int' })
  participationId: number;
}
