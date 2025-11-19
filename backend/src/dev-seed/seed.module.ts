import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UsersModule } from '../users/users.module';
import { MonitoriasPersonalizadasModule } from '../monitorias-personalizadas/monitorias-personalizadas.module';
import { MonitoriasGrupalesModule } from '../monitorias-grupales/monitorias-grupales.module';
import { MonitoriasConfirmadasModule } from '../monitorias-confirmadas/monitorias-confirmadas.module';

@Module({
  imports: [
    UsersModule,
    MonitoriasPersonalizadasModule,
    MonitoriasGrupalesModule,
    MonitoriasConfirmadasModule,
  ],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
