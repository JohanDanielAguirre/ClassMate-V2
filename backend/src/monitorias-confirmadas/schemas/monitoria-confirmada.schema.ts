import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MonitoriaConfirmada extends Document {
  @Prop({ required: true }) fecha: string;
  @Prop({ required: true }) horario: string;
  @Prop({ required: true }) curso: string;
  @Prop({ required: true }) espacio: string;
  @Prop({ required: true, enum: ['personalizada', 'grupal'] }) tipo: 'personalizada' | 'grupal';
  @Prop({ type: [{ id: String, name: String }], default: [] }) estudiantes: {
    id: string;
    name: string;
  }[];
  @Prop() monitoriaPersonalizadaId?: string;
  @Prop() monitoriaGrupalId?: string;
  @Prop({ required: true }) monitorId: string;
}
export const MonitoriaConfirmadaSchema = SchemaFactory.createForClass(MonitoriaConfirmada);
