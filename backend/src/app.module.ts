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
import { RatingsModule } from './ratings/ratings.module';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/classmate';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    UsersModule,
    AuthModule,
    MonitoriasPersonalizadasModule,
    MonitoriasGrupalesModule,
    SolicitudesModule,
    MonitoriasConfirmadasModule,
    DashboardModule,
    SeedModule,
    RatingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
