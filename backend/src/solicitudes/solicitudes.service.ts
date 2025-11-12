import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Solicitud } from './schemas/solicitud.schema';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { User } from '../users/schemas/user.schema';
import { MonitoriaConfirmada } from '../monitorias-confirmadas/schemas/monitoria-confirmada.schema';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectModel(Solicitud.name) private model: Model<Solicitud>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(MonitoriaConfirmada.name) private confirmadasModel: Model<MonitoriaConfirmada>
  ) {}

  async create(dto: CreateSolicitudDto, estudianteId: string) {
    return new this.model({ ...dto, estudianteId }).save();
  }

  async listPendientesByMonitor(monitorId: string) {
    const solicitudes = await this.model.find({ monitorId, estado: 'pendiente' }).exec();
    
    // Obtener información de los estudiantes
    const solicitudesConEstudiante = await Promise.all(
      solicitudes.map(async (solicitud) => {
        const obj = solicitud.toObject();
        const estudiante = await this.userModel.findById(obj.estudianteId).select('name email').exec();
        return {
          ...obj,
          estudiante: estudiante ? {
            id: estudiante._id.toString(),
            name: estudiante.name,
            email: estudiante.email,
          } : null,
        };
      })
    );
    
    return solicitudesConEstudiante;
  }

  async updateEstado(id: string, estado: 'aceptada' | 'rechazada') {
    const solicitud = await this.model.findById(id).exec();
    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    // Si se acepta la solicitud, crear la monitoría confirmada
    if (estado === 'aceptada') {
      // Obtener información del estudiante
      const estudiante = await this.userModel.findById(solicitud.estudianteId).select('name').exec();
      
      if (!estudiante) {
        throw new NotFoundException('Estudiante no encontrado');
      }

      // Verificar si ya existe una monitoría confirmada para esta solicitud
      // (para evitar duplicados si se acepta dos veces)
      const existeConfirmada = await this.confirmadasModel.findOne({
        fecha: solicitud.fecha,
        horario: solicitud.horario,
        monitorId: solicitud.monitorId,
        'estudiantes.id': solicitud.estudianteId,
        tipo: solicitud.tipo,
      }).exec();

      if (!existeConfirmada) {
        // Crear la monitoría confirmada
        const nuevaConfirmada = new this.confirmadasModel({
          fecha: solicitud.fecha,
          horario: solicitud.horario,
          curso: solicitud.curso,
          espacio: solicitud.espacio,
          tipo: solicitud.tipo,
          monitorId: solicitud.monitorId,
          estudiantes: [{
            id: solicitud.estudianteId,
            name: estudiante.name,
          }],
          monitoriaPersonalizadaId: solicitud.monitoriaPersonalizadaId,
          monitoriaGrupalId: solicitud.monitoriaGrupalId,
        });

        await nuevaConfirmada.save();
      }
    }

    // Actualizar el estado de la solicitud
    return this.model.findByIdAndUpdate(id, { estado }, { new: true }).exec();
  }
}

