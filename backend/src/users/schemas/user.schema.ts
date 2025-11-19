import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserRole = 'Monitor' | 'Estudiante';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['Monitor', 'Estudiante'] })
  role: UserRole;

  @Prop({ required: true })
  university: string;

  @Prop()
  avatar?: string;

  @Prop({ default: 0 })
  calificacionMedia?: number; // promedio para monitores
}

export const UserSchema = SchemaFactory.createForClass(User);
