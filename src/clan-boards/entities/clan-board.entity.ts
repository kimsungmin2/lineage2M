import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'clanBoards',
})
export class ClanBoards {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  masterId: number;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'int', nullable: true })
  managerId1: number;

  @Column({ type: 'int', nullable: true })
  managerId2: number;

  @Column({ type: 'int', nullable: true })
  managerId3: number;

  @Column({ type: 'varchar', nullable: true })
  logo: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
