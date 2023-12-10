import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PhotosDto, RegisterDto } from 'src/auth/dto/auth.dto';
import { Client } from 'src/entities/client.entity';
import { Photo } from 'src/entities/photo.entity';
import { UsersService } from 'src/users/users.service';

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
  async register(registerDto: RegisterDto & PhotosDto) {
    const { firstName, lastName, email, password, role, photos } = registerDto;

    const newUser: Client = await this.usersService.create(
      firstName,
      lastName,
      email,
      password,
      role,
    );

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
