import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterWithPhotosDto } from '../auth/dto/auth.dto';
import { Client } from '../entities/client.entity';
import { Photo } from '../entities/photo.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Register new user
   * @param registerDto
   * @returns
   */
  async register(registerDto: RegisterWithPhotosDto) {
    const {
      firstName,
      lastName,
      email,
      password,
      role = 'user',
      photos,
    } = registerDto;

    //create new user
    const newUser: Client = await this.usersService.create(
      firstName,
      lastName,
      email,
      password,
      role,
    );

    //upload photos to AWS S3 and create new Photo models
    const newPhotos: Photo[] = await this.usersService.uploadPhotos(
      newUser.id,
      photos,
    );

    return {
      ...newUser,
      photos: newPhotos,
    };
  }

  /**
   * Login user
   * @param email
   * @param password
   * @returns
   */
  async login(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
