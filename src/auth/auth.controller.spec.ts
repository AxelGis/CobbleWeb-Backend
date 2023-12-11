import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app/app.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';
import { Client } from 'src/entities/client.entity';

describe('AuthController', () => {
  let app: INestApplication;
  let usersService: UsersService;
  const defaultUser = {
    firstName: 'test',
    lastName: 'test',
    email: 'test@test.com',
    password: '123456',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    usersService = app.get<UsersService>(UsersService);
  });

  it('should register new user', async () => {
    jest.spyOn(usersService, 'create').mockResolvedValue({ id: 1 } as Client);
    jest.spyOn(usersService, 'uploadPhotos').mockResolvedValue(null);

    return request(app.getHttpServer())
      .post('/register')
      .send(defaultUser)
      .expect(200);
  });

  it('should return 400 with wrong firstName and lastName', async () => {
    jest.spyOn(usersService, 'create').mockResolvedValue({ id: 1 } as Client);
    jest.spyOn(usersService, 'uploadPhotos').mockResolvedValue(null);

    return request(app.getHttpServer())
      .post('/register')
      .send({
        ...defaultUser,
        firstName: 'a',
        lastName: 'b',
      })
      .expect(400);
  });

  it('should return 400 with wrong password', async () => {
    jest.spyOn(usersService, 'create').mockResolvedValue({ id: 1 } as Client);
    jest.spyOn(usersService, 'uploadPhotos').mockResolvedValue(null);

    return request(app.getHttpServer())
      .post('/register')
      .send({
        ...defaultUser,
        password: '123',
      })
      .expect(400);
  });

  it('should return 400 with wrong email', async () => {
    jest.spyOn(usersService, 'create').mockResolvedValue({ id: 1 } as Client);
    jest.spyOn(usersService, 'uploadPhotos').mockResolvedValue(null);

    return request(app.getHttpServer())
      .post('/register')
      .send({
        ...defaultUser,
        email: 'not-valid',
      })
      .expect(400);
  });
});
