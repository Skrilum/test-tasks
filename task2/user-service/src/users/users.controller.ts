import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('reset-problems')
  async resetProblems(@Res() res: Response) {
    const count = await this.usersService.resetProblems();
    return res.json({ message: 'Problems reset completed', count });
  }
}
