import { z } from 'zod';

export const createUrlSchema = z.object({
  url: z
    .string()
    .url('A URL fornecida não é válida')
    .min(1, 'A URL é obrigatória'),
});

export type CreateUrlDto = z.infer<typeof createUrlSchema>;
