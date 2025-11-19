import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Rating extends Document {
  @Prop({ required: true }) monitoriaConfirmadaId: string; // referencia a MonitoriaConfirmada
  @Prop({ required: true }) monitorId: string; // redundante para facilitar queries
  @Prop({ required: true }) estudianteId: string;
  @Prop({ required: true, min: 1, max: 5 }) score: number;
  @Prop() comentario?: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
RatingSchema.index({ monitoriaConfirmadaId: 1, estudianteId: 1 }, { unique: true });
