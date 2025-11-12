import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoriasConfirmadasService } from './monitorias-confirmadas.service';
import { MonitoriasConfirmadasController } from './monitorias-confirmadas.controller';
import { MonitoriaConfirmada, MonitoriaConfirmadaSchema } from './schemas/monitoria-confirmada.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MonitoriaGrupal, MonitoriaGrupalSchema } from '../monitorias-grupales/schemas/monitoria-grupal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonitoriaConfirmada.name, schema: MonitoriaConfirmadaSchema },
      { name: User.name, schema: UserSchema },
      { name: MonitoriaGrupal.name, schema: MonitoriaGrupalSchema },
    ]),
  ],
  providers: [MonitoriasConfirmadasService],
  controllers: [MonitoriasConfirmadasController],
  exports: [MonitoriasConfirmadasService],
})
export class MonitoriasConfirmadasModule {}

