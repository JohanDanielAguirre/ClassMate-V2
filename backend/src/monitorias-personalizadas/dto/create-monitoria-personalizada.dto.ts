import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMonitoriaPersonalizadaDto {
  @IsString() @IsNotEmpty() curso: string;
  @IsNumber() precioPorHora: number;
  @IsString() @IsNotEmpty() descripcion: string;
}
