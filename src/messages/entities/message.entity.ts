import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReadMessage } from '../type/messageRead.type';

@Entity({
  name: 'messages',
})
export class Message {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  sendUserId: number;

  @Column({ type: 'int' })
  receiveUserId: number;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'int', default: ReadMessage.no })
  status: ReadMessage;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
