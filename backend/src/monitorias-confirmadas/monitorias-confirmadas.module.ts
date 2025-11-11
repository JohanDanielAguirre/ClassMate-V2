import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoriasConfirmadasService } from './monitorias-confirmadas.service';
import { MonitoriasConfirmadasController } from './monitorias-confirmadas.controller';
import { MonitoriaConfirmada, MonitoriaConfirmadaSchema } from './schemas/monitoria-confirmada.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonitoriaConfirmada.name, schema: MonitoriaConfirmadaSchema },
    ]),
  ],
  providers: [MonitoriasConfirmadasService],
  controllers: [MonitoriasConfirmadasController],
  exports: [MonitoriasConfirmadasService],
})
export class MonitoriasConfirmadasModule {}

