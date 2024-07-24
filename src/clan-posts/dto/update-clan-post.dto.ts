import { PartialType } from '@nestjs/swagger';
import { CreateClanPostDto } from './create-clan-post.dto';

export class UpdateClanPostDto extends PartialType(CreateClanPostDto) {}
