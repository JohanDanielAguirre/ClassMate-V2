import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMonitoriaConfirmadaDto {
  @IsString() @IsNotEmpty() fecha: string;
  @IsString() @IsNotEmpty() horario: string;
  @IsString() @IsNotEmpty() curso: string;
  @IsString() @IsNotEmpty() espacio: string;
  @IsEnum(['personalizada','grupal']) tipo: 'personalizada' | 'grupal';
  @IsOptional() @IsString() monitoriaPersonalizadaId?: string;
  @IsOptional() @IsString() monitoriaGrupalId?: string;
}
