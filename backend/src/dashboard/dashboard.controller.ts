import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('monitor')
  async stats(@Req() req: any) {
    return this.service.monitorStats(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('estudiante')
  async estudianteStats(@Req() req: any) {
    return this.service.estudianteStats(req.user.id);
  }
}

