import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  active: z.boolean().optional().default(true),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().min(1).optional(),
  active: z.boolean().optional(),
});

export class CreateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
  })
  password: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Status do usuário',
    example: true,
    default: true,
  })
  active?: boolean;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Status do usuário',
    example: true,
  })
  active?: boolean;
}

export type CreateUserDtoType = z.infer<typeof createUserSchema>;
export type UpdateUserDtoType = z.infer<typeof updateUserSchema>;
