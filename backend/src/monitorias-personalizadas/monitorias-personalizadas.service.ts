import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitoriaPersonalizada } from './schemas/monitoria-personalizada.schema';
import { CreateMonitoriaPersonalizadaDto } from './dto/create-monitoria-personalizada.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class MonitoriasPersonalizadasService {
  constructor(
    @InjectModel(MonitoriaPersonalizada.name) private model: Model<MonitoriaPersonalizada>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(dto: CreateMonitoriaPersonalizadaDto, monitorId: string) {
    return new this.model({ ...dto, monitorId }).save();
  }

  async listByMonitor(monitorId: string) {
    const docs = await this.model.find({ monitorId }).exec();
    return docs.map((d) => d.toObject());
  }

  async update(id: string, dto: CreateMonitoriaPersonalizadaDto, monitorId: string) {
    const monitoria = await this.model.findById(id).exec();
    if (!monitoria) {
      throw new NotFoundException('Monitoría personalizada no encontrada');
    }
    if (monitoria.monitorId !== monitorId) {
      throw new ForbiddenException('No tienes permiso para editar esta monitoría');
    }
    Object.assign(monitoria, dto);
    return monitoria.save();
  }

  async delete(id: string, monitorId: string) {
    const monitoria = await this.model.findById(id).exec();
    if (!monitoria) {
      throw new NotFoundException('Monitoría personalizada no encontrada');
    }
    if (monitoria.monitorId !== monitorId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta monitoría');
    }
    return this.model.findByIdAndDelete(id).exec();
  }

  async listDisponibles() {
    // Obtener todas las monitorías personalizadas
    const todasPersonalizadas = await this.model.find().exec();

    // Para cada personalizada, obtener info del monitor
    const personalizadasConInfo = await Promise.all(
      todasPersonalizadas.map(async (personalizada) => {
        const obj = personalizada.toObject();

        // Obtener información del monitor
        const monitor = await this.userModel
          .findById(obj.monitorId)
          .select('name calificacionMedia')
          .exec();

        return {
          _id: obj._id,
          id: obj._id,
          curso: obj.curso,
          precioPorHora: obj.precioPorHora,
          descripcion: obj.descripcion,
          monitorId: obj.monitorId,
          monitoriaPersonalizadaId: obj._id.toString(),
          monitor: monitor
            ? {
                id: monitor._id.toString(),
                name: monitor.name,
                calificacion: monitor.calificacionMedia || 0,
              }
            : null,
        };
      }),
    );

    // Ordenar alfabéticamente por curso
    personalizadasConInfo.sort((a, b) => a.curso.localeCompare(b.curso));

    return personalizadasConInfo;
  }
}
