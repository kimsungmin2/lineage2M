import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    res.cookie('authorization', `Bearer ${user.accessToken}`, {
      maxAge: 1000 * 60 * 60 * 12,
      httpOnly: true,
      secure: true,
    });
    res.send('로그인에 성공하였습니다.');
  }
}
