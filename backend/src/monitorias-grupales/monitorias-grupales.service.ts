import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitoriaGrupal } from './schemas/monitoria-grupal.schema';
import { CreateMonitoriaGrupalDto } from './dto/create-monitoria-grupal.dto';
import { User } from '../users/schemas/user.schema';
import { MonitoriaConfirmada } from '../monitorias-confirmadas/schemas/monitoria-confirmada.schema';
import { Solicitud } from '../solicitudes/schemas/solicitud.schema';

@Injectable()
export class MonitoriasGrupalesService {
  constructor(
    @InjectModel(MonitoriaGrupal.name) private model: Model<MonitoriaGrupal>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(MonitoriaConfirmada.name) private confirmadasModel: Model<MonitoriaConfirmada>,
    @InjectModel(Solicitud.name) private solicitudesModel: Model<Solicitud>
  ) {}

  async create(dto: CreateMonitoriaGrupalDto, monitorId: string) {
    const aforoString = dto.aforoMaximo === undefined || dto.aforoMaximo === null
      ? 'ilimitado'
      : dto.aforoMaximo === 'ilimitado'
        ? 'ilimitado'
        : String(dto.aforoMaximo);
    return new this.model({ ...dto, aforoMaximo: aforoString, monitorId }).save();
  }

  async listByMonitor(monitorId: string) {
    const hoy = new Date().toISOString().split('T')[0];
    const now = new Date();
    const horaActual = now.toTimeString().slice(0, 5);

    const docs = await this.model.find({ monitorId }).exec();
    
    const grupalesConStats = await Promise.all(
      docs.map(async (d) => {
        const obj = d.toObject();
        let aforo: number | 'ilimitado';
        if (obj.aforoMaximo === 'ilimitado') aforo = 'ilimitado';
        else {
          const parsed = parseInt(obj.aforoMaximo, 10);
          aforo = isNaN(parsed) ? 'ilimitado' : parsed;
        }

        // Buscar sesiones confirmadas futuras de esta monitoría grupal
        const sesionesConfirmadas = await this.confirmadasModel
          .find({ monitoriaGrupalId: obj._id.toString(), tipo: 'grupal' })
          .exec();

        // Filtrar sesiones futuras
        const sesionesFuturas = sesionesConfirmadas.filter(m => {
          if (m.fecha > hoy) return true;
          if (m.fecha === hoy && m.horario >= horaActual) return true;
          return false;
        });

        // Contar estudiantes únicos confirmados en sesiones futuras
        const estudiantesUnicos = new Set<string>();
        sesionesFuturas.forEach(sesion => {
          sesion.estudiantes.forEach(est => {
            estudiantesUnicos.add(est.id);
          });
        });
        const estudiantesConfirmados = estudiantesUnicos.size;

        // Contar solicitudes pendientes relacionadas con esta monitoría grupal
        const interesados = await this.solicitudesModel.countDocuments({
          monitoriaGrupalId: obj._id.toString(),
          estado: 'pendiente',
        }).exec();

        return {
          ...obj,
          aforoMaximo: aforo,
          estudiantesConfirmados,
          interesados,
        };
      })
    );

    return grupalesConStats;
  }

  async update(id: string, dto: CreateMonitoriaGrupalDto, monitorId: string) {
    const monitoria = await this.model.findById(id).exec();
    if (!monitoria) {
      throw new NotFoundException('Monitoría grupal no encontrada');
    }
    if (monitoria.monitorId !== monitorId) {
      throw new ForbiddenException('No tienes permiso para editar esta monitoría');
    }
    
    // Convertir aforoMaximo a string
    const aforoString = dto.aforoMaximo === undefined || dto.aforoMaximo === null
      ? 'ilimitado'
      : dto.aforoMaximo === 'ilimitado'
        ? 'ilimitado'
        : String(dto.aforoMaximo);
    
    Object.assign(monitoria, { ...dto, aforoMaximo: aforoString });
    return monitoria.save();
  }

  async delete(id: string, monitorId: string) {
    const monitoria = await this.model.findById(id).exec();
    if (!monitoria) {
      throw new NotFoundException('Monitoría grupal no encontrada');
    }
    if (monitoria.monitorId !== monitorId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta monitoría');
    }
    return this.model.findByIdAndDelete(id).exec();
  }

  async listDisponibles() {
    const hoy = new Date().toISOString().split('T')[0];
    const now = new Date();
    const horaActual = now.toTimeString().slice(0, 5);

    // Obtener todas las monitorías grupales
    const todasGrupales = await this.model.find().exec();

    // Para cada grupal, obtener info del monitor y próxima sesión confirmada
    const grupalesConInfo = await Promise.all(
      todasGrupales.map(async (grupal) => {
        const obj = grupal.toObject();
        
        // Obtener información del monitor
        const monitor = await this.userModel.findById(obj.monitorId).select('name calificacionMedia').exec();
        
        // Convertir aforo
        let aforo: number | 'ilimitado';
        if (obj.aforoMaximo === 'ilimitado') aforo = 'ilimitado';
        else {
          const parsed = parseInt(obj.aforoMaximo, 10);
          aforo = isNaN(parsed) ? 'ilimitado' : parsed;
        }

        // Buscar próxima sesión confirmada de esta monitoría grupal
        const sesionesConfirmadas = await this.confirmadasModel
          .find({ monitoriaGrupalId: obj._id.toString(), tipo: 'grupal' })
          .exec();

        // Filtrar sesiones futuras confirmadas
        const sesionesFuturasConfirmadas = sesionesConfirmadas
          .filter(m => {
            if (m.fecha > hoy) return true;
            if (m.fecha === hoy && m.horario >= horaActual) return true;
            return false;
          })
          .map(m => m.toObject())
          .sort((a, b) => {
            const fechaCompare = a.fecha.localeCompare(b.fecha);
            return fechaCompare !== 0 ? fechaCompare : a.horario.localeCompare(b.horario);
          });

        const proximaSesionConfirmada = sesionesFuturasConfirmadas.length > 0 ? sesionesFuturasConfirmadas[0] : null;

        // Calcular próxima sesión potencial basada en días/horarios (aunque no esté confirmada)
        const proximaSesionPotencial = this.calcularProximaSesionPotencial(obj.diasYHorarios, hoy, horaActual);

        return {
          _id: obj._id,
          id: obj._id,
          curso: obj.curso,
          recurrencia: obj.recurrencia,
          diasYHorarios: obj.diasYHorarios,
          aforoMaximo: aforo,
          monitorId: obj.monitorId,
          monitoriaGrupalId: obj._id.toString(),
          monitor: monitor ? {
            id: monitor._id.toString(),
            name: monitor.name,
            calificacion: monitor.calificacionMedia || 0,
          } : null,
          proximaSesion: proximaSesionConfirmada ? {
            fecha: proximaSesionConfirmada.fecha,
            horario: proximaSesionConfirmada.horario,
            espacio: proximaSesionConfirmada.espacio,
            estudiantesConfirmados: proximaSesionConfirmada.estudiantes?.length || 0,
          } : proximaSesionPotencial ? {
            fecha: proximaSesionPotencial.fecha,
            horario: proximaSesionPotencial.horario,
            espacio: 'Por definir',
            estudiantesConfirmados: 0,
          } : null,
        };
      })
    );

    // Ordenar alfabéticamente por curso
    grupalesConInfo.sort((a, b) => a.curso.localeCompare(b.curso));

    return grupalesConInfo;
  }

  private calcularProximaSesionPotencial(diasYHorarios: { dia: string; hora: string }[], hoy: string, horaActual: string) {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoyDate = new Date(hoy);
    
    // Buscar el próximo día/horario en los próximos 14 días
    for (let i = 0; i < 14; i++) {
      const fecha = new Date(hoyDate);
      fecha.setDate(fecha.getDate() + i);
      const diaSemana = fecha.getDay();
      const nombreDia = diasSemana[diaSemana];
      const fechaStr = fecha.toISOString().split('T')[0];

      // Buscar si este día está en los días de la monitoría
      const diaHorario = diasYHorarios.find(
        (dh) => dh.dia === nombreDia
      );

      if (diaHorario) {
        // Si es hoy, verificar que el horario sea futuro
        if (i === 0 && diaHorario.hora < horaActual) {
          continue;
        }
        return {
          fecha: fechaStr,
          horario: diaHorario.hora,
        };
      }
    }

    return null;
  }
}
