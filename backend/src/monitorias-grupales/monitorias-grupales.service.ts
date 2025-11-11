import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitoriaGrupal } from './schemas/monitoria-grupal.schema';
import { CreateMonitoriaGrupalDto } from './dto/create-monitoria-grupal.dto';

@Injectable()
export class MonitoriasGrupalesService {
  constructor(@InjectModel(MonitoriaGrupal.name) private model: Model<MonitoriaGrupal>) {}

  async create(dto: CreateMonitoriaGrupalDto, monitorId: string) {
    const aforoString = dto.aforoMaximo === undefined || dto.aforoMaximo === null
      ? 'ilimitado'
      : dto.aforoMaximo === 'ilimitado'
        ? 'ilimitado'
        : String(dto.aforoMaximo);
    return new this.model({ ...dto, aforoMaximo: aforoString, monitorId }).save();
  }

  async listByMonitor(monitorId: string) {
    const docs = await this.model.find({ monitorId }).exec();
    return docs.map(d => {
      const obj = d.toObject();
      let aforo: number | 'ilimitado';
      if (obj.aforoMaximo === 'ilimitado') aforo = 'ilimitado';
      else {
        const parsed = parseInt(obj.aforoMaximo, 10);
        aforo = isNaN(parsed) ? 'ilimitado' : parsed;
      }
      return { ...obj, aforoMaximo: aforo };
    });
  }
}
