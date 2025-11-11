import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitoriaConfirmada } from '../monitorias-confirmadas/schemas/monitoria-confirmada.schema';

@Injectable()
export class DashboardService {
  constructor(@InjectModel(MonitoriaConfirmada.name) private confirmadas: Model<MonitoriaConfirmada>) {}

  async monitorStats(monitorId: string) {
    const all = await this.confirmadas.find({ monitorId }).exec();
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const estaSemana = all.filter(m => new Date(m.fecha) >= weekAgo && new Date(m.fecha) <= now).length;
    const proxima = all.filter(m => new Date(m.fecha) >= now).sort((a,b)=>a.fecha.localeCompare(b.fecha))[0];
    const total = all.length;
    const calificacionMedia = 4.5; // placeholder
    return {
      monitoriasConfirmadasEstaSemana: estaSemana,
      proximaMonitoria: proxima ? { fecha: proxima.fecha, horario: proxima.horario, ubicacion: proxima.espacio, curso: proxima.curso } : null,
      totalMonitoriasDadas: total,
      calificacionMedia,
    };
  }
}

