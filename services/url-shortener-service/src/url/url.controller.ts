import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';
import { CreateUrlDto, createUrlSchema } from './schemas';
import { ZodValidationPipe } from 'src/zod-validation/zod-validation.pipe';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten-url')
  @UsePipes(new ZodValidationPipe(createUrlSchema))
  async shortenUrl(@Body() body: CreateUrlDto) {
    return this.urlService.shortenUrl(body.url);
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
