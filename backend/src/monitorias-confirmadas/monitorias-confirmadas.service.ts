import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitoriaConfirmada } from './schemas/monitoria-confirmada.schema';
import { CreateMonitoriaConfirmadaDto } from './dto/create-monitoria-confirmada.dto';
import { User } from '../users/schemas/user.schema';
import { MonitoriaGrupal } from '../monitorias-grupales/schemas/monitoria-grupal.schema';

@Injectable()
export class MonitoriasConfirmadasService {
  constructor(
    @InjectModel(MonitoriaConfirmada.name) private model: Model<MonitoriaConfirmada>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(MonitoriaGrupal.name) private grupalModel: Model<MonitoriaGrupal>,
  ) {}

  async create(dto: CreateMonitoriaConfirmadaDto, monitorId: string) {
    return new this.model({ ...dto, monitorId, estudiantes: [] }).save();
  }

  async listByMonitor(monitorId: string) {
    return this.model.find({ monitorId }).exec();
  }

  async listByEstudiante(estudianteId: string) {
    const monitorias = await this.model.find({ 'estudiantes.id': estudianteId }).exec();

    // Obtener información del monitor para cada monitoría
    const monitoriasConMonitor = await Promise.all(
      monitorias.map(async (monitoria) => {
        const obj = monitoria.toObject();
        const monitor = await this.userModel.findById(obj.monitorId).select('name').exec();

        return {
          ...obj,
          monitor: monitor
            ? {
                id: monitor._id.toString(),
                name: monitor.name,
              }
            : null,
        };
      }),
    );

    return monitoriasConMonitor;
  }

  async confirmarAsistenciaGrupal(monitoriaGrupalId: string, estudianteId: string) {
    const hoy = new Date().toISOString().split('T')[0];
    const now = new Date();
    const horaActual = now.toTimeString().slice(0, 5);

    // Obtener la monitoría grupal para verificar el aforo
    const monitoriaGrupal = await this.grupalModel.findById(monitoriaGrupalId).exec();
    if (!monitoriaGrupal) {
      throw new NotFoundException('Monitoría grupal no encontrada');
    }

    // Obtener información del estudiante
    const estudiante = await this.userModel.findById(estudianteId).select('name').exec();
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Buscar todas las sesiones confirmadas de esta monitoría grupal
    const sesionesConfirmadas = await this.model.find({ monitoriaGrupalId, tipo: 'grupal' }).exec();

    // Filtrar sesiones futuras y ordenar
    let sesionesFuturas = sesionesConfirmadas
      .filter((m) => {
        if (m.fecha > hoy) return true;
        if (m.fecha === hoy && m.horario >= horaActual) return true;
        return false;
      })
      .sort((a, b) => {
        const fechaCompare = a.fecha.localeCompare(b.fecha);
        return fechaCompare !== 0 ? fechaCompare : a.horario.localeCompare(b.horario);
      });

    // Si no hay sesiones futuras, crear la próxima sesión basada en la monitoría grupal
    let proximaSesion;
    if (sesionesFuturas.length === 0) {
      proximaSesion = await this.crearProximaSesionGrupal(monitoriaGrupal, hoy, horaActual);
      if (!proximaSesion) {
        throw new NotFoundException(
          'No se pudo determinar la próxima sesión para esta monitoría grupal',
        );
      }
    } else {
      proximaSesion = sesionesFuturas[0];
    }

    // Verificar si el estudiante ya está registrado
    const yaRegistrado = proximaSesion.estudiantes.some((e) => e.id === estudianteId);
    if (yaRegistrado) {
      throw new BadRequestException('Ya estás registrado en esta sesión');
    }

    // Verificar aforo
    const aforoMaximo =
      monitoriaGrupal.aforoMaximo === 'ilimitado'
        ? Infinity
        : parseInt(monitoriaGrupal.aforoMaximo, 10);

    if (proximaSesion.estudiantes.length >= aforoMaximo) {
      throw new BadRequestException('No hay espacio disponible en esta sesión');
    }

    // Agregar estudiante a la sesión
    proximaSesion.estudiantes.push({
      id: estudianteId,
      name: estudiante.name,
    });

    await proximaSesion.save();

    return proximaSesion.toObject();
  }

  private async crearProximaSesionGrupal(monitoriaGrupal: any, hoy: string, horaActual: string) {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoyDate = new Date(hoy);

    // Encontrar el próximo día/horario de la monitoría grupal
    let proximaFecha: string | null = null;
    let proximoHorario: string | null = null;

    // Buscar el próximo día/horario en los próximos 14 días
    for (let i = 0; i < 14; i++) {
      const fecha = new Date(hoyDate);
      fecha.setDate(fecha.getDate() + i);
      const diaSemana = fecha.getDay();
      const nombreDia = diasSemana[diaSemana];
      const fechaStr = fecha.toISOString().split('T')[0];

      // Buscar si este día está en los días de la monitoría
      const diaHorario = monitoriaGrupal.diasYHorarios.find((dh: any) => dh.dia === nombreDia);

      if (diaHorario) {
        // Si es hoy, verificar que el horario sea futuro
        if (i === 0 && diaHorario.hora < horaActual) {
          continue;
        }
        proximaFecha = fechaStr;
        proximoHorario = diaHorario.hora;
        break;
      }
    }

    if (!proximaFecha || !proximoHorario) {
      return null;
    }

    // Crear la sesión confirmada
    const nuevaSesion = new this.model({
      fecha: proximaFecha,
      horario: proximoHorario,
      curso: monitoriaGrupal.curso,
      espacio: 'Por definir',
      tipo: 'grupal',
      monitoriaGrupalId: monitoriaGrupal._id.toString(),
      monitorId: monitoriaGrupal.monitorId,
      estudiantes: [],
    });

    return await nuevaSesion.save();
  }
}
