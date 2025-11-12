import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoriasGrupalesService } from './monitorias-grupales.service';
import { MonitoriasGrupalesController } from './monitorias-grupales.controller';
import { MonitoriaGrupal, MonitoriaGrupalSchema } from './schemas/monitoria-grupal.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MonitoriaConfirmada, MonitoriaConfirmadaSchema } from '../monitorias-confirmadas/schemas/monitoria-confirmada.schema';
import { Solicitud, SolicitudSchema } from '../solicitudes/schemas/solicitud.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonitoriaGrupal.name, schema: MonitoriaGrupalSchema },
      { name: User.name, schema: UserSchema },
      { name: MonitoriaConfirmada.name, schema: MonitoriaConfirmadaSchema },
      { name: Solicitud.name, schema: SolicitudSchema },
    ]),
  ],
  providers: [MonitoriasGrupalesService],
  controllers: [MonitoriasGrupalesController],
  exports: [MonitoriasGrupalesService],
})
export class MonitoriasGrupalesModule {}

