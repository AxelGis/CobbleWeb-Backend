import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { checkNodeEnv, useConfigs } from 'src/etc';
import * as path from 'node:path';
import { AppConfig } from 'src/app/app.config';
import { Client } from 'src/entities/client.entity';
import { Photo } from 'src/entities/photo.entity';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { S3Module } from 'nestjs-s3';

const { isTesting, isDev } = checkNodeEnv();

const envFilePaths: string[] = [];

if (isTesting) {
  envFilePaths.push(path.resolve(process.cwd(), '.env.e2e'));
} else if (isDev) {
  envFilePaths.push(path.resolve(process.cwd(), '.env.dev'));
}

@Module({
  imports: [
    ...useConfigs([AppConfig], envFilePaths),
    TypeOrmModule.forRootAsync({
      useFactory: async (appConfig: AppConfig) => ({
        type: 'postgres',
        url: appConfig.POSTGRESQL_DB_URL,
        entities: [Client, Photo],
        synchronize: true,
      }),
      inject: [AppConfig],
    }),
    S3Module.forRootAsync({
      useFactory: (appConfig: AppConfig) => ({
        config: {
          credentials: {
            accessKeyId: appConfig.S3_ACCESS_KEY,
            secretAccessKey: appConfig.S3_SECRET_KEY,
          },
          region: appConfig.S3_REGION,
          forcePathStyle: true,
          signatureVersion: 'v4',
        },
      }),
      inject: [AppConfig],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
