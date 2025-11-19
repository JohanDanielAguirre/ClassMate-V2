import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitoriaConfirmada } from '../monitorias-confirmadas/schemas/monitoria-confirmada.schema';
import { UsersService } from '../users/users.service';
import { SolicitudesService } from '../solicitudes/solicitudes.service';
import { Rating } from '../ratings/schemas/rating.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(MonitoriaConfirmada.name)
    private confirmadas: Model<MonitoriaConfirmada>,
    @InjectModel(Rating.name)
    private ratings: Model<Rating>,
    private usersService: UsersService,
    private solicitudesService: SolicitudesService,
  ) {}

  async monitorStats(monitorId: string) {
    const all = await this.confirmadas.find({ monitorId }).exec();
    const hoy = new Date().toISOString().split('T')[0];
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const monitoriasFuturas = all
      .filter((m) => {
        if (m.fecha > hoy) return true;
        if (m.fecha === hoy) {
          const horaActual = now.toTimeString().slice(0, 5);
          return m.horario >= horaActual;
        }
        return false;
      })
      .map((m) => m.toObject())
      .sort((a, b) => {
        const fechaCompare = a.fecha.localeCompare(b.fecha);
        return fechaCompare !== 0 ? fechaCompare : a.horario.localeCompare(b.horario);
      });

    const proxima = monitoriasFuturas.length > 0 ? monitoriasFuturas[0] : null;

    const monitoriasPasadas = all.filter((m) => {
      if (m.fecha < hoy) return true;
      if (m.fecha === hoy) {
        const horaActual = now.toTimeString().slice(0, 5);
        return m.horario < horaActual;
      }
      return false;
    }).length;

    const estaSemana = all.filter((m) => {
      return m.fecha >= weekAgoStr && m.fecha <= hoy;
    }).length;

    const user = await this.usersService.findById(monitorId);
    const calificacionMedia = user.calificacionMedia || 0;

    const solicitudesPendientes = await this.solicitudesService.listPendientesByMonitor(monitorId);

    const monitoriasHoy = all
      .filter((m) => m.fecha === hoy)
      .map((m) => m.toObject())
      .sort((a, b) => a.horario.localeCompare(b.horario));

    return {
      monitoriasConfirmadasEstaSemana: estaSemana,
      proximaMonitoria: proxima
        ? {
            fecha: proxima.fecha,
            horario: proxima.horario,
            ubicacion: proxima.espacio,
            curso: proxima.curso,
          }
        : null,
      totalMonitoriasDadas: monitoriasPasadas,
      calificacionMedia,
      solicitudesPendientes: solicitudesPendientes.map((s) => ({
        _id: s._id,
        id: s._id,
        fecha: s.fecha,
        horario: s.horario,
        curso: s.curso,
        espacio: s.espacio,
        tipo: s.tipo,
        estado: s.estado,
        tieneConflicto: s.tieneConflicto || false,
        estudiante: s.estudiante,
        monitoriaGrupalId: s.monitoriaGrupalId,
        monitoriaPersonalizadaId: s.monitoriaPersonalizadaId,
      })),
      horarioHoy: monitoriasHoy.map((m) => ({
        _id: m._id,
        id: m._id,
        fecha: m.fecha,
        horario: m.horario,
        curso: m.curso,
        espacio: m.espacio,
        tipo: m.tipo,
        estudiantes: m.estudiantes,
        monitoriaPersonalizadaId: m.monitoriaPersonalizadaId,
        monitoriaGrupalId: m.monitoriaGrupalId,
      })),
      monitoriasFuturas: monitoriasFuturas.map((m) => ({
        _id: m._id,
        id: m._id,
        fecha: m.fecha,
        horario: m.horario,
        curso: m.curso,
        espacio: m.espacio,
        tipo: m.tipo,
        estudiantes: m.estudiantes,
        monitoriaPersonalizadaId: m.monitoriaPersonalizadaId,
        monitoriaGrupalId: m.monitoriaGrupalId,
      })),
    };
  }

  async estudianteStats(estudianteId: string) {
    const hoy = new Date().toISOString().split('T')[0];
    const now = new Date();
    const horaActual = now.toTimeString().slice(0, 5);

    const todas = await this.confirmadas.find({ 'estudiantes.id': estudianteId }).exec();

    const monitoriaIds = todas.map((m) => m._id.toString());
    const ratings = await this.ratings
      .find({ monitoriaConfirmadaId: { $in: monitoriaIds }, estudianteId })
      .exec();
    const ratingsMap = new Map(ratings.map((r) => [r.monitoriaConfirmadaId, r]));

    const todasConMonitor = await Promise.all(
      todas.map(async (monitoria) => {
        const obj = monitoria.toObject();
        const monitor = await this.usersService.findById(obj.monitorId);
        const rating = ratingsMap.get(obj._id.toString());
        const yaPaso = obj.fecha < hoy || (obj.fecha === hoy && obj.horario < horaActual);
        return {
          ...obj,
          monitor: monitor
            ? {
                id: monitor._id.toString(),
                name: monitor.name,
              }
            : null,
          yaPaso,
          calificada: !!rating,
          calificacion: rating?.score,
        };
      }),
    );

    const monitoriasFuturas = todasConMonitor
      .filter((m) => {
        if (m.fecha > hoy) return true;
        if (m.fecha === hoy && m.horario >= horaActual) return true;
        return false;
      })
      .sort((a, b) => {
        const fechaCompare = a.fecha.localeCompare(b.fecha);
        return fechaCompare !== 0 ? fechaCompare : a.horario.localeCompare(b.horario);
      });

    const proximaMonitoria = monitoriasFuturas.length > 0 ? monitoriasFuturas[0] : null;

    const monitoriasHoy = todasConMonitor.filter((m) => m.fecha === hoy).length;

    const monitoriasConfirmadas = todasConMonitor.map((m) => ({
      _id: m._id,
      id: m._id,
      fecha: m.fecha,
      horario: m.horario,
      curso: m.curso,
      espacio: m.espacio,
      tipo: m.tipo,
      monitor: m.monitor,
      monitoriaPersonalizadaId: m.monitoriaPersonalizadaId,
      monitoriaGrupalId: m.monitoriaGrupalId,
      yaPaso: m.yaPaso,
      calificada: m.calificada,
      calificacion: m.calificacion,
    }));

    return {
      proximaMonitoria: proximaMonitoria
        ? {
            _id: proximaMonitoria._id,
            id: proximaMonitoria._id,
            fecha: proximaMonitoria.fecha,
            horario: proximaMonitoria.horario,
            curso: proximaMonitoria.curso,
            espacio: proximaMonitoria.espacio,
            tipo: proximaMonitoria.tipo,
            monitor: proximaMonitoria.monitor,
            monitoriaPersonalizadaId: proximaMonitoria.monitoriaPersonalizadaId,
            monitoriaGrupalId: proximaMonitoria.monitoriaGrupalId,
            yaPaso: proximaMonitoria.yaPaso,
            calificada: proximaMonitoria.calificada,
            calificacion: proximaMonitoria.calificacion,
          }
        : null,
      monitoriasHoy,
      monitoriasConfirmadas,
    };
  }
}
