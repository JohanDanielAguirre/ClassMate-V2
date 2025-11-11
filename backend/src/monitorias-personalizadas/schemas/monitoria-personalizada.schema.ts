import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MonitoriaPersonalizada extends Document {
  @Prop({ required: true }) curso: string;
  @Prop({ required: true }) precioPorHora: number;
  @Prop({ required: true }) descripcion: string;
  @Prop({ required: true }) monitorId: string;
}
export const MonitoriaPersonalizadaSchema = SchemaFactory.createForClass(MonitoriaPersonalizada);

