import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private service: RatingsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Estudiante')
  @Post()
  async create(@Body() dto: CreateRatingDto, @Req() req: any) {
    return this.service.create(dto, req.user.id);
  }

  // Listar ratings de un monitor (público)
  @Get('monitor/:monitorId')
  async listByMonitor(@Param('monitorId') monitorId: string) {
    return this.service.listByMonitor(monitorId);
  }

  // Obtener el rating del usuario autenticado para una monitoría específica
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Estudiante')
  @Get('monitoria/:monitoriaConfirmadaId/mine')
  async myRating(@Param('monitoriaConfirmadaId') id: string, @Req() req: any) {
    return this.service.getRatingForMonitoria(id, req.user.id);
  }

  // Listar todos los ratings de una monitoría específica (público)
  @Get('monitoria/:monitoriaConfirmadaId')
  async listByMonitoria(@Param('monitoriaConfirmadaId') id: string) {
    return this.service.listByMonitoria(id);
  }
}
