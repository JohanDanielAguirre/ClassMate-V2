import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { Solicitud, SolicitudSchema } from './schemas/solicitud.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Solicitud.name, schema: SolicitudSchema }])],
  providers: [SolicitudesService],
  controllers: [SolicitudesController],
  exports: [SolicitudesService],
})
export class SolicitudesModule {}

