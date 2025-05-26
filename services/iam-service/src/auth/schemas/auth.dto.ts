import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

export interface AuthEntity {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  id: string;
  type: 'access' | 'refresh';
}
