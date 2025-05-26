import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';
import { CreateUrlDto, createUrlSchema } from './schemas/url.schema';
import { ZodValidationPipe } from 'src/zod-validation/zod-validation.pipe';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { RequiredAuthGuard } from 'src/auth/guards/required-auth.guard';
import { UpdateUrlDto } from './schemas/url.schema';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten-url')
  @UseGuards(OptionalAuthGuard)
  async shortenUrl(
    @User() user: any,
    @Body(new ZodValidationPipe(createUrlSchema)) body: CreateUrlDto,
  ) {
    return this.urlService.shortenUrl(body.url, user?.id);
  }

  @Get('urls')
  @UseGuards(RequiredAuthGuard)
  async getUrls(@User() user: any) {
    return this.urlService.getUrls(user.id);
  }

  @Get(':shortUrl')
  async redirectToOriginalUrl(
    @Res() res: Response,
    @Param('shortUrl') shortUrl: string,
  ) {
    const { originalUrl } = await this.urlService.getOriginalUrl(shortUrl);
    return res.redirect(301, originalUrl);
  }

  @Put('urls/:shortUrl')
  @UseGuards(RequiredAuthGuard)
  async updateUrl(
    @Param('shortUrl') shortUrl: string,
    @Body() body: UpdateUrlDto,
    @User() user: any,
  ) {
    return this.urlService.updateUrl(shortUrl, body, user.id);
  }

  @Delete('urls/:shortUrl')
  @UseGuards(RequiredAuthGuard)
  async deleteUrl(@Param('shortUrl') shortUrl: string, @User() user: any) {
    return this.urlService.deleteUrl(shortUrl, user.id);
  }
}
