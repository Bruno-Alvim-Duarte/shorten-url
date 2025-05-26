import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import {
  AuthEntity,
  LoginDto,
  RefreshTokenDto,
  TokenPayload,
} from './schemas/auth.dto';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthEntity> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.generateTokens(user.id);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthEntity> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      const storedToken = await this.prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          revokedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Token inválido ou expirado');
      }

      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });

      return this.generateTokens(payload.id);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private async generateTokens(userId: string): Promise<AuthEntity> {
    const accessToken = this.jwtService.sign(
      { id: userId, type: 'access' } as TokenPayload,
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { id: userId, type: 'refresh' } as TokenPayload,
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: add(new Date(), { days: 7 }),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
