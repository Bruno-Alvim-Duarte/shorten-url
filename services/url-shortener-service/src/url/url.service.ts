import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UrlService {
  private readonly nanoid = customAlphabet(urlAlphabet, 6);

  constructor(private readonly prisma: PrismaService) {}

  async shortenUrl(
    url: string,
    userId?: string,
  ): Promise<{ shortUrl: string; originalUrl: string }> {
    let shortId: string;
    let existingUrl: any;
    let attempts = 0;

    do {
      shortId = this.nanoid();
      existingUrl = await this.prisma.url.findUnique({
        where: { shortUrl: shortId },
      });
      attempts += 1;
    } while (existingUrl && attempts < 10);

    // Se o loop não encontrar uma URL válida, lança um erro interno.
    // Isso é uma medida de segurança para evitar loops infinitos. Mas a chance de em 10 tentativas não encontrar uma URL válida é quase nula.
    if (existingUrl) {
      throw new InternalServerErrorException('Erro ao gerar URL encurtada');
    }

    const data: any = {
      originalUrl: url,
      shortUrl: shortId,
    };

    if (userId && userId !== 'Token inválido') {
      data.userId = userId;
    }

    await this.prisma.url.create({
      data,
    });

    if (!userId || userId === 'Token inválido') {
      data.message =
        'Autentique-se para ter acesso a benefícios como listar, atualizar e remover suas URLs encurtadas';
    }

    return data;
  }

  async getOriginalUrl(shortUrl: string): Promise<{ originalUrl: string }> {
    const url = await this.prisma.url.findUnique({
      where: { shortUrl },
    });
    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }
    await this.prisma.url.update({
      where: { shortUrl },
      data: { accessCount: url.accessCount + 1 },
    });
    return { originalUrl: url.originalUrl };
  }
}
