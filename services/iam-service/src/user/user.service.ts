import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    if (
      await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      })
    ) {
      throw new BadRequestException('User with this email already exists');
    }

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
        active: createUserDto.active,
      },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async validatePassword(plainTextPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
