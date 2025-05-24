import { z, ZodSchema } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    name: z.string().min(1),
  });

  it('should be defined', () => {
    expect(new ZodValidationPipe(schema)).toBeDefined();
  });

  it('should throw an error if the value is not valid', () => {
    const pipe = new ZodValidationPipe(schema);
    expect(() => pipe.transform({ name: '' })).toThrow(BadRequestException);
  });

  it('should return the value if it is valid', () => {
    const pipe = new ZodValidationPipe(schema);
    const value = { name: 'John Doe' };
    expect(pipe.transform(value)).toEqual(value);
  });

  it('should throw an bad request error if the value is not an object', () => {
    const pipe = new ZodValidationPipe(schema);
    expect(() => pipe.transform('not an object')).toThrow(BadRequestException);
  });

  it('should thrown an type error if the error is not a ZodError', () => {
    const pipe = new ZodValidationPipe({} as ZodSchema);
    expect(() => pipe.transform({ name: 123 })).toThrow(TypeError);
  });
});
