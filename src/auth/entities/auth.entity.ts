import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  userId: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;
}
