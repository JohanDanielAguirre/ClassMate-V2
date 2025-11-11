import { Body, Controller, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private service: SolicitudesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateSolicitudDto, @Req() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Get('monitor/:monitorId')
  async list(@Param('monitorId') monitorId: string) {
    return this.service.listPendientesByMonitor(monitorId);
  }

  @Patch(':id/estado')
  async updateEstado(@Param('id') id: string, @Body() body: { estado: 'aceptada' | 'rechazada' }) {
    return this.service.updateEstado(id, body.estado);
  }
}

