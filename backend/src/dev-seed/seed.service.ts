import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MonitoriasPersonalizadasService } from '../monitorias-personalizadas/monitorias-personalizadas.service';
import { MonitoriasGrupalesService } from '../monitorias-grupales/monitorias-grupales.service';
import { MonitoriasConfirmadasService } from '../monitorias-confirmadas/monitorias-confirmadas.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  constructor(
    private users: UsersService,
    private pers: MonitoriasPersonalizadasService,
    private grup: MonitoriasGrupalesService,
    private conf: MonitoriasConfirmadasService,
  ) {}

  async run() {
    this.logger.log('Ejecutando seed de desarrollo');
    const email = 'sebastian.escobar@example.com';
    let monitor = await this.users.findByEmail(email);
    if (!monitor) {
      monitor = await this.users.create({
        name: 'Dr. Sebastián Escobar',
        email,
        password: 'password',
        role: 'Monitor',
        university: 'ICESI',
        avatar: undefined,
      });
    }
    const existingPers = await this.pers.listByMonitor(monitor.id);
    if (existingPers.length === 0) {
      await this.pers.create(
        { curso: 'APO 1', precioPorHora: 25000, descripcion: 'Fundamentos POO.' },
        monitor.id,
      );
      await this.pers.create(
        { curso: 'Estructuras de Datos', precioPorHora: 30000, descripcion: 'Árboles y grafos.' },
        monitor.id,
      );
    }
    const existingGrup = await this.grup.listByMonitor(monitor.id);
    if (existingGrup.length === 0) {
      await this.grup.create(
        {
          curso: 'APO 3',
          recurrencia: 'una-a-la-semana',
          diasYHorarios: [{ dia: 'Jueves', hora: '13:00' }],
          aforoMaximo: 20,
        },
        monitor.id,
      );
      await this.grup.create(
        {
          curso: 'Base de Datos',
          recurrencia: 'dos-a-la-semana',
          diasYHorarios: [
            { dia: 'Lunes', hora: '10:00' },
            { dia: 'Miércoles', hora: '10:00' },
          ],
          aforoMaximo: 'ilimitado',
        },
        monitor.id,
      );
    }
    this.logger.log('Seed completado');
    return { ok: true };
  }
}
