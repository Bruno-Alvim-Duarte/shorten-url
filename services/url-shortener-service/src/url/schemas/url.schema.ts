import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const createUrlSchema = z.object({
  url: z
    .string()
    .url('A URL fornecida não é válida')
    .min(1, 'A URL é obrigatória'),
});

export const updateUrlSchema = z.object({
  url: z
    .string()
    .url('A URL fornecida não é válida')
    .min(1, 'A URL é obrigatória'),
});

export class CreateUrlDto {
  @ApiProperty({
    description: 'URL original que será encurtada',
    example: 'https://github.com/Bruno-Alvim-Duarte/Shorten-URL',
  })
  url: string;
}

export class UpdateUrlDto {
  @ApiProperty({
    description: 'Nova URL original',
    example: 'https://github.com/Bruno-Alvim-Duarte/Shorten-URL/novo',
  })
  url: string;
}

export type CreateUrlDtoType = z.infer<typeof createUrlSchema>;
export type UpdateUrlDtoType = z.infer<typeof updateUrlSchema>;
