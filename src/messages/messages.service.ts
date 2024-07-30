import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ReadMessage } from './type/messageRead.type';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private mailsRepository: Repository<Message>,
  ) {}

  async getManyMessage(userId: number) {
    return await this.mailsRepository.find({
      where: { receiveUserId: userId },
    });
  }

  async getMessage(messageId: number, userId: number) {
    const message = await this.mailsRepository.findOne({
      where: {
        id: messageId,
        receiveUserId: userId,
      },
    });
    if (!message) {
      throw new NotFoundException();
    }

    return message;
  }

  async deleteMessage(messageId: number, userId: number) {
    await this.getMessage(messageId, userId);
    return await this.mailsRepository.softDelete({ id: messageId });
  }

  async readMessage(messageId: number, userId: number) {
    await this.mailsRepository.update(messageId, {
      status: ReadMessage.yes,
    });

    return await this.mailsRepository.findOne({
      where: {
        id: messageId,
        receiveUserId: userId,
      },
    });
  }

  async createMessage(userId: number, createMessageDto: CreateMessageDto) {
    return await this.mailsRepository.save({
      sendUserId: userId,
      ...createMessageDto,
    });
  }
}
