import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app/app.module';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = new JwtService({
      secret: 'secret',
    });
    await app.init();
  });

  it('should return the user data for a valid JWT', async () => {
    const user = { userId: 1, email: 'test@test.com' };
    const token = await jwtService.signAsync(user);

    const test = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(test.body.userId).toBe(user.userId);
    expect(test.body.email).toBe(user.email);
  });

  it('should return 401 for an invalid JWT', async () => {
    const token = 'invalid-jwt-token';

    return request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
