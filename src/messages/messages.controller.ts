import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('message')
@UseGuards()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: '나에게 온 메시지 조회' })
  @Get('')
  async getManyMessage(@Body() userId: number) {
    return await this.messagesService.getManyMessage(userId);
  }

  @ApiOperation({ summary: '메시지 조회' })
  @Get(':messageId')
  async getMessage(@Req() req, @Param('messageId') messageId: number) {
    const { userId } = req.user;
    return await this.messagesService.readMessage(messageId, userId);
  }

  @ApiOperation({ summary: '메시지 보내기' })
  @Post('')
  async createMessage(@Body() createMessageDto: CreateMessageDto, @Req() req) {
    const { userId } = req.user;
    return await this.messagesService.createMessage(userId, createMessageDto);
  }

  @ApiOperation({ summary: '메시지 삭제' })
  @Delete(':messageId')
  async deleteMessage(@Param('messageId') messageId: number, @Req() req) {
    const { userId } = req.user;
    return await this.messagesService.deleteMessage(messageId, userId);
  }
}
