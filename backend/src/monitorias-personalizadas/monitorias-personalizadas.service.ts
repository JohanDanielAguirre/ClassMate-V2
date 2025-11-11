import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitoriaPersonalizada } from './schemas/monitoria-personalizada.schema';
import { CreateMonitoriaPersonalizadaDto } from './dto/create-monitoria-personalizada.dto';

@Injectable()
export class MonitoriasPersonalizadasService {
  constructor(@InjectModel(MonitoriaPersonalizada.name) private model: Model<MonitoriaPersonalizada>) {}

  async create(dto: CreateMonitoriaPersonalizadaDto, monitorId: string) {
    return new this.model({ ...dto, monitorId }).save();
  }

  async listByMonitor(monitorId: string) {
    return this.model.find({ monitorId }).exec();
  }
}

