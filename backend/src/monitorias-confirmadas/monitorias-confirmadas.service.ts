import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitoriaConfirmada } from './schemas/monitoria-confirmada.schema';
import { CreateMonitoriaConfirmadaDto } from './dto/create-monitoria-confirmada.dto';

@Injectable()
export class MonitoriasConfirmadasService {
  constructor(@InjectModel(MonitoriaConfirmada.name) private model: Model<MonitoriaConfirmada>) {}

  async create(dto: CreateMonitoriaConfirmadaDto, monitorId: string) {
    return new this.model({ ...dto, monitorId, estudiantes: [] }).save();
    }

  async listByMonitor(monitorId: string) {
    return this.model.find({ monitorId }).exec();
  }

  async listByEstudiante(estudianteId: string) {
    return this.model.find({ 'estudiantes.id': estudianteId }).exec();
  }
}

