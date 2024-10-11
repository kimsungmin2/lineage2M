import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Render,
  Res,
} from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { CreateBidDto } from 'src/bid/dto/create-bid.dto';

@Controller('')
export class ParticipationsController {
  constructor(private readonly participationsService: ParticipationsService) {}

  @Get('/participation/:id')
  async findByParticipations(@Param('id') id: number) {
    const findData = await this.participationsService.findByParticipations(id);

    return {
      statusCode: HttpStatus.OK,
      data: findData,
    };
  }

  @Render('mainPage.ejs')
  @Get()
  async findAllParticipations() {
    const findAllData =
      await this.participationsService.findAllParticipations();

    return {
      statusCode: HttpStatus.OK,
      data: findAllData,
    };
  }

  @Get('/register-item')
  @Render('registerItemPage')
  registerItemPage() {
    return {};
  }

  @Post('/participation')
  async createParticipations(
    @Body() createParticipationDto: CreateParticipationDto,
  ) {
    const createData = await this.participationsService.createParticipations(
      createParticipationDto.boss,
      createParticipationDto.clearTime,
      createParticipationDto.item,
    );

    return {
      statusCode: HttpStatus.CREATED,
      data: createData,
    };
  }

  @Post('/bid/:participationId')
  async createBid(
    @Param('participationId') participationId: number,
    @Body() createBidDto: CreateBidDto,
  ) {
    const createData = await this.participationsService.createBid(
      participationId,
      createBidDto.name,
      createBidDto.price,
      createBidDto.participation,
    );

    return {
      statusCode: HttpStatus.CREATED,
      data: createData,
    };
  }
}
