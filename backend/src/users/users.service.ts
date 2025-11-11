import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({ email: dto.email }).exec();
    if (existing) throw new ConflictException('Email ya registrado');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = new this.userModel({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
      university: dto.university,
      avatar: dto.avatar,
    });
    return created.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async listMonitors(): Promise<User[]> {
    return this.userModel.find({ role: 'Monitor' }).select('-passwordHash').exec();
  }
}

