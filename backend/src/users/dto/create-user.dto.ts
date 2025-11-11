import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEnum(['Monitor', 'Estudiante'])
  role: 'Monitor' | 'Estudiante';

  @IsNotEmpty()
  @IsString()
  university: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

