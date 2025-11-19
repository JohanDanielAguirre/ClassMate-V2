import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMonitoriaGrupalDto {
  @IsString() @IsNotEmpty() curso: string;
  @IsEnum(['dos-a-la-semana', 'una-a-la-semana', 'una-cada-dos-semanas']) recurrencia:
    | 'dos-a-la-semana'
    | 'una-a-la-semana'
    | 'una-cada-dos-semanas';
  @IsArray() diasYHorarios: { dia: string; hora: string }[];
  @IsOptional() aforoMaximo: number | 'ilimitado';
}
