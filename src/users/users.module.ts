import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { Photo } from '../entities/photo.entity';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Photo])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
