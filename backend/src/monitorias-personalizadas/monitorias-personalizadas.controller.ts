import { Controller, Post, Body, Param, Get, UseGuards, Req } from '@nestjs/common';
import { MonitoriasPersonalizadasService } from './monitorias-personalizadas.service';
import { CreateMonitoriaPersonalizadaDto } from './dto/create-monitoria-personalizada.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('monitorias-personalizadas')
export class MonitoriasPersonalizadasController {
  constructor(private service: MonitoriasPersonalizadasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateMonitoriaPersonalizadaDto, @Req() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Get('monitor/:monitorId')
  async list(@Param('monitorId') monitorId: string) {
    return this.service.listByMonitor(monitorId);
  }
}

