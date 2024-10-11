import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  deadLine: number;

  @Column({ type: 'varchar', nullable: false })
  boss: string;

  @Column({ type: 'varchar', nullable: false })
  item: string;

  @Column({ type: 'timestamp', nullable: false })
  clearTime: Date;
}
