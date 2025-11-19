import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import {
  MonitoriaConfirmada,
  MonitoriaConfirmadaSchema,
} from '../monitorias-confirmadas/schemas/monitoria-confirmada.schema';
import { UsersModule } from '../users/users.module';
import { SolicitudesModule } from '../solicitudes/solicitudes.module';
import { Rating, RatingSchema } from '../ratings/schemas/rating.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonitoriaConfirmada.name, schema: MonitoriaConfirmadaSchema },
      { name: Rating.name, schema: RatingSchema },
    ]),
    UsersModule,
    SolicitudesModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
