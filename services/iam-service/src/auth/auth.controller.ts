import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, AuthEntity, RefreshTokenDto } from './schemas/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Realizar login',
    description: 'Autentica um usuário e retorna os tokens de acesso',
  })
  @ApiResponse({
    status: 201,
    description: 'Login realizado com sucesso',
    type: AuthEntity,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthEntity> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Renovar token',
    description: 'Gera um novo token de acesso usando o refresh token',
  })
  @ApiResponse({
    status: 201,
    description: 'Token renovado com sucesso',
    type: AuthEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou expirado',
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthEntity> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
