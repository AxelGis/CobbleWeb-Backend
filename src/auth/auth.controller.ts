import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../auth/decorators/public.decorator';
import { LoginDto, RegisterWithPhotosDto } from '../auth/dto/auth.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { Client } from '../entities/client.entity';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @FormDataRequest()
  @Post('register')
  register(@Body() registerDto: RegisterWithPhotosDto): Promise<Client> {
    return this.authService.register(registerDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }
}
