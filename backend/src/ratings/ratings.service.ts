import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from './schemas/rating.schema';
import { CreateRatingDto } from './dto/create-rating.dto';
import { MonitoriaConfirmada } from '../monitorias-confirmadas/schemas/monitoria-confirmada.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @InjectModel(MonitoriaConfirmada.name)
    private monitoriaModel: Model<MonitoriaConfirmada>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(dto: CreateRatingDto, estudianteId: string) {
    const monitoria = await this.monitoriaModel.findById(dto.monitoriaConfirmadaId).exec();
    if (!monitoria) throw new NotFoundException('Monitoría confirmada no encontrada');

    // Validar que ya pasó
    const hoy = new Date().toISOString().split('T')[0];
    const now = new Date();
    const horaActual = now.toTimeString().slice(0, 5);
    const yaPaso =
      monitoria.fecha < hoy || (monitoria.fecha === hoy && monitoria.horario < horaActual);
    // Permitir bypass de tiempo en el futuro si se necesitara (placeholder)
    const bypassTime = process.env.BYPASS_RATING_TIME === 'true';
    if (!yaPaso && !bypassTime)
      throw new BadRequestException('No puedes calificar una monitoría que aún no ha ocurrido');

    // Validar asistencia o permitir bypass
    const asistio = monitoria.estudiantes.some((e) => e.id === estudianteId);
    const bypassAttendance = process.env.BYPASS_RATING_ATTENDANCE === 'true';
    if (!asistio && !bypassAttendance)
      throw new BadRequestException('Solo pueden calificar estudiantes que asistieron');

    const monitoriaIdStr = monitoria._id.toString();

    // Evitar calificación duplicada
    const existente = await this.ratingModel
      .findOne({ monitoriaConfirmadaId: monitoriaIdStr, estudianteId })
      .exec();
    if (existente) throw new ConflictException('Ya calificaste esta monitoría');

    const created = new this.ratingModel({
      monitoriaConfirmadaId: monitoriaIdStr,
      monitorId: monitoria.monitorId,
      estudianteId,
      score: dto.score,
      comentario: dto.comentario,
    });
    await created.save();

    // Recalcular promedio del monitor
    const agg = await this.ratingModel
      .aggregate([
        { $match: { monitorId: monitoria.monitorId } },
        { $group: { _id: '$monitorId', avg: { $avg: '$score' } } },
      ])
      .exec();
    const avg = agg.length ? agg[0].avg : 0;
    await this.userModel.findByIdAndUpdate(monitoria.monitorId, { calificacionMedia: avg }).exec();

    return created.toObject();
  }

  async listByMonitor(monitorId: string) {
    return this.ratingModel.find({ monitorId }).exec();
  }

  async listByMonitoria(monitoriaConfirmadaId: string) {
    return this.ratingModel.find({ monitoriaConfirmadaId }).exec();
  }

  async getRatingForMonitoria(monitoriaConfirmadaId: string, estudianteId: string) {
    return this.ratingModel.findOne({ monitoriaConfirmadaId, estudianteId }).exec();
  }
}
