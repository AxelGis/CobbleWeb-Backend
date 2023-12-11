import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from '../app/app.config';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (appConfig: AppConfig) => ({
        secret: appConfig.JWT_SECRET,
        signOptions: { expiresIn: appConfig.JWT_LIFETIME },
      }),
      inject: [AppConfig],
    }),
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
