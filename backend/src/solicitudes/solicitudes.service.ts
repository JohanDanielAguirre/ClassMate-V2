import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Solicitud } from './schemas/solicitud.schema';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';

@Injectable()
export class SolicitudesService {
  constructor(@InjectModel(Solicitud.name) private model: Model<Solicitud>) {}

  async create(dto: CreateSolicitudDto, estudianteId: string) {
    return new this.model({ ...dto, estudianteId }).save();
  }

  async listPendientesByMonitor(monitorId: string) {
    return this.model.find({ monitorId, estado: 'pendiente' }).exec();
  }

  async updateEstado(id: string, estado: 'aceptada' | 'rechazada') {
    return this.model.findByIdAndUpdate(id, { estado }, { new: true }).exec();
  }
}

