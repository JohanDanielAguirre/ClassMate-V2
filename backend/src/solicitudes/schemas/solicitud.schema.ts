import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Solicitud extends Document {
  @Prop({ required: true }) fecha: string;
  @Prop({ required: true }) horario: string;
  @Prop({ required: true }) curso: string;
  @Prop({ required: true }) espacio: string;
  @Prop({ required: true, enum: ['personalizada', 'grupal'] }) tipo: 'personalizada' | 'grupal';
  @Prop() monitoriaGrupalId?: string;
  @Prop() monitoriaPersonalizadaId?: string;
  @Prop({ required: true }) estudianteId: string;
  @Prop({ required: true }) monitorId: string;
  @Prop({ required: true, enum: ['pendiente', 'aceptada', 'rechazada'], default: 'pendiente' })
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  @Prop({ default: false }) tieneConflicto?: boolean;
}
export const SolicitudSchema = SchemaFactory.createForClass(Solicitud);
