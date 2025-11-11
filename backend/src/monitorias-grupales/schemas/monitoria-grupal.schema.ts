import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MonitoriaGrupal extends Document {
  @Prop({ required: true }) curso: string;
  @Prop({ required: true, enum: ['dos-a-la-semana','una-a-la-semana','una-cada-dos-semanas'] }) recurrencia: string;
  @Prop({ type: [{ dia: String, hora: String }], default: [] }) diasYHorarios: { dia: string; hora: string }[];
  @Prop({ required: true }) aforoMaximo: number | 'ilimitado';
  @Prop({ required: true }) monitorId: string;
}
export const MonitoriaGrupalSchema = SchemaFactory.createForClass(MonitoriaGrupal);

