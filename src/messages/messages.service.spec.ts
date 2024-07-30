import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ReadMessage } from './type/messageRead.type';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

const messageId = 1;
const userId = 1;
const mockMessage: Message = {
  id: messageId,
  receiveUserId: userId,
  sendUserId: 2,
  status: ReadMessage.no,
  createdAt: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  content: '안녕하세요 Mint Clan입니다',
};

describe('MessagesService', () => {
  let service: MessagesService;
  let mailsRepository: jest.Mocked<Repository<any>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Repository),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            softDelete: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    mailsRepository = module.get(getRepositoryToken(Repository));
  });

  describe('getManyMessage', () => {
    it('메시지 확인', async () => {
      const mockMessages = [{ id: 1, receiveUserId: userId }];

      mailsRepository.find.mockResolvedValue(mockMessages);

      const result = await service.getManyMessage(userId);

      expect(result).toEqual(mockMessages);
      expect(mailsRepository.find).toHaveBeenCalledWith({
        where: { receiveUserId: userId },
      });
    });
  });

  describe('getMessage', () => {
    it('메시지 상세 조회 성공', async () => {
      const mockMessage = { id: messageId, receiveUserId: userId };

      mailsRepository.findOne.mockResolvedValue(mockMessage);

      const result = await service.getMessage(messageId, userId);

      expect(result).toEqual(mockMessage);
      expect(mailsRepository.findOne).toHaveBeenCalledWith({
        where: { id: messageId, receiveUserId: userId },
      });
    });

    it('메시지 id가 맞지 않을 때', async () => {
      mailsRepository.findOne.mockResolvedValue(null);

      await expect(service.getMessage(messageId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteMessage', () => {
    it('메시지 삭제 성공', async () => {
      jest.spyOn(service, 'getMessage').mockResolvedValue(mockMessage);
      mailsRepository.softDelete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.deleteMessage(messageId, userId);

      expect(result).toEqual({ affected: 1 });
      expect(service.getMessage).toHaveBeenCalledWith(messageId, userId);
      expect(mailsRepository.softDelete).toHaveBeenCalledWith({
        id: messageId,
      });
    });
  });

  describe('readMessage', () => {
    it('메시지 읽음 표시', async () => {
      const mockUpdateResult = { affected: 1, raw: [], generatedMaps: [] };

      mailsRepository.update.mockResolvedValue(mockUpdateResult as any);
      mailsRepository.findOne.mockResolvedValue(mockMessage);

      const result = await service.readMessage(messageId, userId);

      expect(result).toEqual(mockMessage);
      expect(mailsRepository.update).toHaveBeenCalledWith(messageId, {
        status: ReadMessage.yes,
      });
      expect(mailsRepository.findOne).toHaveBeenCalledWith({
        where: { id: messageId, receiveUserId: userId },
      });
    });
  });

  describe('createMessage', () => {
    it('메시지 생성', async () => {
      const createMessageDto: CreateMessageDto = {
        receiveUserId: 1,
        content: '안녕하세요 Mint Clan입니다.',
      };
      const mockMessage = { id: 1, sendUserId: userId, ...createMessageDto };

      mailsRepository.save.mockResolvedValue(mockMessage);

      const result = await service.createMessage(userId, createMessageDto);

      expect(result).toEqual(mockMessage);
      expect(mailsRepository.save).toHaveBeenCalledWith({
        sendUserId: userId,
        ...createMessageDto,
      });
    });
  });
});
