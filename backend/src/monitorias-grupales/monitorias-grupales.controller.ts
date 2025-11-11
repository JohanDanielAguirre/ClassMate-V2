import { Controller, Post, Body, Param, Get, UseGuards, Req } from '@nestjs/common';
import { MonitoriasGrupalesService } from './monitorias-grupales.service';
import { CreateMonitoriaGrupalDto } from './dto/create-monitoria-grupal.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('monitorias-grupales')
export class MonitoriasGrupalesController {
  constructor(private service: MonitoriasGrupalesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateMonitoriaGrupalDto, @Req() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Get('monitor/:monitorId')
  async list(@Param('monitorId') monitorId: string) {
    return this.service.listByMonitor(monitorId);
  }
}

