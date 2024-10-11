import { ParticipationEnum } from 'src/utils/type/participationEnum_type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'int', enum: ParticipationEnum })
  participation: number;

  @Column({ type: 'int' })
  participationId: number;
}
