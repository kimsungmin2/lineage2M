import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { CreateBidDto } from 'src/bid/dto/create-bid.dto';

@Controller('')
export class ParticipationsController {
  constructor(private readonly participationsService: ParticipationsService) {}

  @Get('/:id')
  async findByParticipations(@Param('id') id: number) {
    const findData = await this.participationsService.findByParticipations(id);

    return {
      statusCode: HttpStatus.OK,
      data: findData,
    };
  }

  @Get()
  async findAllParticipations() {
    const findAllData =
      await this.participationsService.findAllParticipations();

    return {
      statusCode: HttpStatus.OK,
      data: findAllData,
    };
  }

  @Post('/:id')
  async createParticipations(
    @Param('id') id: number,
    @Body() createParticipationDto: CreateParticipationDto,
  ) {
    const createData = await this.participationsService.createParticipations(
      id,
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
