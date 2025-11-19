import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');
    const { passwordHash, ...rest } = user.toObject();
    return rest;
  }

  async login(userPayload: { id: string; email: string; role: string }) {
    const token = await this.jwt.signAsync({
      sub: userPayload.id,
      email: userPayload.email,
      role: userPayload.role,
    });
    return { access_token: token };
  }
}
