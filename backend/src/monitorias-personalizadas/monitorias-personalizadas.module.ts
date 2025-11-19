import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoriasPersonalizadasService } from './monitorias-personalizadas.service';
import { MonitoriasPersonalizadasController } from './monitorias-personalizadas.controller';
import {
  MonitoriaPersonalizada,
  MonitoriaPersonalizadaSchema,
} from './schemas/monitoria-personalizada.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonitoriaPersonalizada.name, schema: MonitoriaPersonalizadaSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [MonitoriasPersonalizadasService],
  controllers: [MonitoriasPersonalizadasController],
  exports: [MonitoriasPersonalizadasService],
})
export class MonitoriasPersonalizadasModule {}
