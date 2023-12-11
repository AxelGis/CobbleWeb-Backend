import { Controller, Get, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UsersService } from '../users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  findMe(
    @Request()
    req: ExpressRequest & { user: { userId: number; email: string } },
  ) {
    return req.user;
  }
}
