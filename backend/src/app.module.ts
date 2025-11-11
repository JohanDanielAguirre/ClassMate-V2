import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MonitoriasPersonalizadasModule } from './monitorias-personalizadas/monitorias-personalizadas.module';
import { MonitoriasGrupalesModule } from './monitorias-grupales/monitorias-grupales.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { MonitoriasConfirmadasModule } from './monitorias-confirmadas/monitorias-confirmadas.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SeedModule } from './dev-seed/seed.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://mongodb:27017/classmate'),
    UsersModule,
    AuthModule,
    MonitoriasPersonalizadasModule,
    MonitoriasGrupalesModule,
    SolicitudesModule,
    MonitoriasConfirmadasModule,
    DashboardModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
