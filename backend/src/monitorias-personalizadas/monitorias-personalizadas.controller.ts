import { Controller, Post, Body, Param, Get, Put, Delete, UseGuards, Req } from '@nestjs/common';
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

  @Get('disponibles')
  async listDisponibles() {
    return this.service.listDisponibles();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CreateMonitoriaPersonalizadaDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.service.delete(id, req.user.id);
  }
}
