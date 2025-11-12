import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { MonitoriaConfirmada, MonitoriaConfirmadaSchema } from '../monitorias-confirmadas/schemas/monitoria-confirmada.schema';
import { UsersModule } from '../users/users.module';
import { SolicitudesModule } from '../solicitudes/solicitudes.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonitoriaConfirmada.name, schema: MonitoriaConfirmadaSchema },
    ]),
    UsersModule,
    SolicitudesModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

