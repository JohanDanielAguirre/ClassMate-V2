import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitoriaGrupal } from './schemas/monitoria-grupal.schema';
import { CreateMonitoriaGrupalDto } from './dto/create-monitoria-grupal.dto';

@Injectable()
export class MonitoriasGrupalesService {
  constructor(@InjectModel(MonitoriaGrupal.name) private model: Model<MonitoriaGrupal>) {}

  async create(dto: CreateMonitoriaGrupalDto, monitorId: string) {
    return new this.model({ ...dto, monitorId }).save();
  }

  async listByMonitor(monitorId: string) {
    return this.model.find({ monitorId }).exec();
  }
}

