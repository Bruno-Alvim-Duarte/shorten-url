import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatória'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET é obrigatória'),
  SHORTENER_PORT: z.string().min(1, 'SHORTENER_PORT é obrigatória'),
  SHORTENER_BASE_URL: z.string().min(1, 'SHORTENER_BASE_URL é obrigatória'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        campo: err.path.join('.'),
        mensagem: err.message,
      }));

      console.error('\nErro de validação das variáveis de ambiente:');
      console.error(JSON.stringify(errors, null, 2));
      process.exit(1);
    }

    throw error;
  }
}
