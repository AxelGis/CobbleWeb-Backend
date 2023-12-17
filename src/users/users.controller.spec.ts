import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app/app.module';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

describe('UsersController', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = new JwtService({
      secret: 'secret',
    });
    await app.init();
    usersService = app.get<UsersService>(UsersService);
  });

  it('should return the user data for a valid JWT', async () => {
    const user = { userId: 1, email: 'test@test.com' };
    const token = await jwtService.signAsync(user);

    jest.spyOn(usersService, 'findById').mockResolvedValue({
      ...user,
      id: 1,
      firstName: null,
      lastName: null,
      fullName: null,
      avatar: '',
      role: 'user',
      password: null,
      createdAt: null,
      updatedAt: null,
      active: true,
      photos: [],
    });

    const test = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(test.body.userId).toBe(user.userId);
    expect(test.body.email).toBe(user.email);
  });

  it('should return 401 for an invalid JWT', async () => {
    const token = 'invalid-jwt-token';

    jest.spyOn(usersService, 'findById').mockResolvedValue(null);

    return request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
