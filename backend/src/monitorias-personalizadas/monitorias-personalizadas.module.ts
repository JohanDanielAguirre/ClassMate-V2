import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoriasPersonalizadasService } from './monitorias-personalizadas.service';
import { MonitoriasPersonalizadasController } from './monitorias-personalizadas.controller';
import { MonitoriaPersonalizada, MonitoriaPersonalizadaSchema } from './schemas/monitoria-personalizada.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonitoriaPersonalizada.name, schema: MonitoriaPersonalizadaSchema },
    ]),
  ],
  providers: [MonitoriasPersonalizadasService],
  controllers: [MonitoriasPersonalizadasController],
  exports: [MonitoriasPersonalizadasService],
})
export class MonitoriasPersonalizadasModule {}

