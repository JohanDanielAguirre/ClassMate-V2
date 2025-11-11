import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MonitoriaGrupal extends Document {
  @Prop({ required: true }) curso: string;
  @Prop({ required: true, enum: ['dos-a-la-semana','una-a-la-semana','una-cada-dos-semanas'] }) recurrencia: string;
  @Prop({ type: [{ dia: String, hora: String }], default: [] }) diasYHorarios: { dia: string; hora: string }[];
  // Se almacena como string: 'ilimitado' o un número en texto (p.ej. '20') para simplificar el esquema
  @Prop({ required: true, type: String }) aforoMaximo: string;
  @Prop({ required: true }) monitorId: string;
}
export const MonitoriaGrupalSchema = SchemaFactory.createForClass(MonitoriaGrupal);
