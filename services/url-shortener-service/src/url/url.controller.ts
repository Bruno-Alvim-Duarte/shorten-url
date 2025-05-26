import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';
import { CreateUrlDto, createUrlSchema } from './schemas';
import { ZodValidationPipe } from 'src/zod-validation/zod-validation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/decorators/user.decorator';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten-url')
  @UseGuards(AuthGuard)
  async shortenUrl(
    @User() user: any,
    @Body(new ZodValidationPipe(createUrlSchema)) body: CreateUrlDto,
  ) {
    return this.urlService.shortenUrl(body.url, user?.id);
  }

  @Get(':shortUrl')
  async redirectToOriginalUrl(
    @Res() res: Response,
    @Param('shortUrl') shortUrl: string,
  ) {
    const { originalUrl } = await this.urlService.getOriginalUrl(shortUrl);
    return res.redirect(301, originalUrl);
  }
}
