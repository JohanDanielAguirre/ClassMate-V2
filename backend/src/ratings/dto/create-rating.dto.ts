import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateRatingDto {
  @IsString() @IsNotEmpty() monitoriaConfirmadaId: string;
  @IsInt() @Min(1) @Max(5) score: number;
  @IsOptional() @IsString() comentario?: string;
}
