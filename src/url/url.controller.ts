import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten-url')
  async shortenUrl(@Body() body: { url: string }) {
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
