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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('urls')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten-url')
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Encurtar uma URL',
    description:
      'Encurta uma URL. Se autenticado, a URL será associada ao usuário.',
  })
  @ApiResponse({ status: 201, description: 'URL encurtada com sucesso' })
  @ApiResponse({ status: 400, description: 'URL inválida' })
  async shortenUrl(
    @User() user: any,
    @Body(new ZodValidationPipe(createUrlSchema)) body: CreateUrlDto,
  ) {
    return this.urlService.shortenUrl(body.url, user?.id);
  }

  @Get('urls')
  @UseGuards(RequiredAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as URLs do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de URLs retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getUrls(@User() user: any) {
    return this.urlService.getUrls(user.id);
  }

  @Get(':shortUrl')
  @ApiOperation({ summary: 'Redirecionar para URL original' })
  @ApiResponse({ status: 301, description: 'Redirecionado com sucesso' })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  async redirectToOriginalUrl(
    @Res() res: Response,
    @Param('shortUrl') shortUrl: string,
  ) {
    const { originalUrl } = await this.urlService.getOriginalUrl(shortUrl);
    return res.redirect(301, originalUrl);
  }

  @Put('urls/:shortUrl')
  @UseGuards(RequiredAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma URL' })
  @ApiResponse({ status: 200, description: 'URL atualizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Proibido - URL pertence a outro usuário',
  })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  async updateUrl(
    @Param('shortUrl') shortUrl: string,
    @Body() body: UpdateUrlDto,
    @User() user: any,
  ) {
    return this.urlService.updateUrl(shortUrl, body, user.id);
  }

  @Delete('urls/:shortUrl')
  @UseGuards(RequiredAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar uma URL' })
  @ApiResponse({ status: 200, description: 'URL deletada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Proibido - URL pertence a outro usuário',
  })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  async deleteUrl(@Param('shortUrl') shortUrl: string, @User() user: any) {
    return this.urlService.deleteUrl(shortUrl, user.id);
  }
}
