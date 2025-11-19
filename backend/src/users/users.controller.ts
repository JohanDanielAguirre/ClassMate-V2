import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    const { passwordHash, ...rest } = user.toObject();
    return rest;
  }

  @Get('monitors')
  async listMonitors() {
    return this.usersService.listMonitors();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    const { passwordHash, ...rest } = user.toObject();
    return rest;
  }
}
