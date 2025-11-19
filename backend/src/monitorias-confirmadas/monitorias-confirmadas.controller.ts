import { Controller, Post, Body, Param, Get, UseGuards, Req } from '@nestjs/common';
import { MonitoriasConfirmadasService } from './monitorias-confirmadas.service';
import { CreateMonitoriaConfirmadaDto } from './dto/create-monitoria-confirmada.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('monitorias-confirmadas')
export class MonitoriasConfirmadasController {
  constructor(private service: MonitoriasConfirmadasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateMonitoriaConfirmadaDto, @Req() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Get('monitor/:monitorId')
  async listMonitor(@Param('monitorId') monitorId: string) {
    return this.service.listByMonitor(monitorId);
  }

  @Get('estudiante/:estudianteId')
  async listEstudiante(@Param('estudianteId') estudianteId: string) {
    return this.service.listByEstudiante(estudianteId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('grupal/:monitoriaGrupalId/confirmar')
  async confirmarAsistenciaGrupal(
    @Param('monitoriaGrupalId') monitoriaGrupalId: string,
    @Req() req: any,
  ) {
    return this.service.confirmarAsistenciaGrupal(monitoriaGrupalId, req.user.id);
  }
}
