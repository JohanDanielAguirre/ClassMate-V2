import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoriasGrupalesService } from './monitorias-grupales.service';
import { MonitoriasGrupalesController } from './monitorias-grupales.controller';
import { MonitoriaGrupal, MonitoriaGrupalSchema } from './schemas/monitoria-grupal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonitoriaGrupal.name, schema: MonitoriaGrupalSchema },
    ]),
  ],
  providers: [MonitoriasGrupalesService],
  controllers: [MonitoriasGrupalesController],
  exports: [MonitoriasGrupalesService],
})
export class MonitoriasGrupalesModule {}

