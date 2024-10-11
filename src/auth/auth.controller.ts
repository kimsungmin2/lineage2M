import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.authService.login(
      loginDto.userId,
      loginDto.password,
    );

    res.cookie('authorization', `Bearer ${user.accessToken}`, {
      maxAge: 1000 * 60 * 60 * 12,
      httpOnly: false,
      secure: false,
    });

    return res.json({ success: true });
  }

  @Get('/login')
  loginPage(@Res() res) {
    res.render('loginPage');
  }
}
