import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSolicitudDto {
  @IsString() @IsNotEmpty() fecha: string;
  @IsString() @IsNotEmpty() horario: string;
  @IsString() @IsNotEmpty() curso: string;
  @IsString() @IsNotEmpty() espacio: string;
  @IsEnum(['personalizada', 'grupal']) tipo: 'personalizada' | 'grupal';
  @IsOptional() @IsString() monitoriaGrupalId?: string;
  @IsOptional() @IsString() monitoriaPersonalizadaId?: string;
  @IsString() @IsNotEmpty() monitorId: string;
}
