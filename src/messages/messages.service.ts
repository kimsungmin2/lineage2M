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

  async getMessage(messageId: number) {
    const message = await this.mailsRepository.findOne({
      where: {
        id: messageId,
      },
    });
    if (!message) {
      throw new NotFoundException();
    }

    return message;
  }

  async deleteMessage(messageId: number) {
    await this.getMessage(messageId);
    return await this.mailsRepository.softDelete({ id: messageId });
  }

  async readMessage(messageId: number) {
    await this.mailsRepository.update(messageId, {
      status: ReadMessage.yes,
    });

    return await this.mailsRepository.findOne({
      where: {
        id: messageId,
      },
    });
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    return await this.mailsRepository.save({ ...createMessageDto });
  }

  async createClanMessage(clanId: number) {}
}
