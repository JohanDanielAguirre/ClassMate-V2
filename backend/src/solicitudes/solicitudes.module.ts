import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { Solicitud, SolicitudSchema } from './schemas/solicitud.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MonitoriaConfirmada, MonitoriaConfirmadaSchema } from '../monitorias-confirmadas/schemas/monitoria-confirmada.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Solicitud.name, schema: SolicitudSchema },
      { name: User.name, schema: UserSchema },
      { name: MonitoriaConfirmada.name, schema: MonitoriaConfirmadaSchema },
    ]),
  ],
  providers: [SolicitudesService],
  controllers: [SolicitudesController],
  exports: [SolicitudesService],
})
export class SolicitudesModule {}

