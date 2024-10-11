import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: false })
  deadLine: number;

  @Column({ type: 'varchar', nullable: false })
  boss: string;

  @Column({ type: 'varchar', nullable: false })
  item: string;

  @Column({ type: 'timestamp', nullable: false })
  clearTime: Date;

  @Column({ type: 'int', nullable: false, default: 0 })
  check: number;
}
