import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Users } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersInfoRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}
  async login(email: string, password: string) {
    const user = await this.usersInfoRepository.findOne({
      select: ['id', 'userId', 'password'],
      where: { userId: email },
    });

    if (user.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: 1000 * 60 * 60 * 24 * 30,
    });

    return { accessToken };
  }
}
