import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('monitor/:monitorId')
  async stats(@Param('monitorId') monitorId: string) {
    return this.service.monitorStats(monitorId);
  }
}

