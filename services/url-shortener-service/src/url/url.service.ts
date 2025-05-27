import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { PrismaService } from 'src/prisma.service';
import { UpdateUrlDto } from './schemas/url.schema';

@Injectable()
export class UrlService {
  private readonly nanoid = customAlphabet(urlAlphabet, 6);

  constructor(private readonly prisma: PrismaService) {}

  async shortenUrl(
    url: string,
    userId?: string,
  ): Promise<{ url: any; message: string }> {
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

    const urlCreated = await this.prisma.url.create({
      data,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    let message = 'URL encurtada com sucesso';
    if (!userId || userId === 'Token inválido') {
      message =
        'Autentique-se para ter acesso a benefícios como listar, atualizar e remover suas URLs encurtadas';
    }

    return {
      url: {
        ...urlCreated,
        shortUrl: `${process.env.SHORTENER_BASE_URL}/${urlCreated.shortUrl}`,
      },
      message,
    };
  }

  async getOriginalUrl(shortUrl: string): Promise<{ originalUrl: string }> {
    const url = await this.prisma.url.findUnique({
      where: { shortUrl, deletedAt: null },
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
  async getUrls(userId: string) {
    const urls = await this.prisma.url.findMany({
      where: { userId, deletedAt: null },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    const urlsWithBaseUrl = urls.map(
      ({ updatedAt, deletedAt, userId, ...rest }) => ({
        ...rest,
        shortUrl: `${process.env.SHORTENER_BASE_URL}/${rest.shortUrl}`,
      }),
    );
    return { urls: urlsWithBaseUrl };
  }

  async updateUrl(shortUrl: string, body: UpdateUrlDto, userId: string) {
    const url = await this.prisma.url.findUnique({
      where: { shortUrl, deletedAt: null },
    });
    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }
    if (url.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta URL',
      );
    }
    const {
      updatedAt,
      deletedAt,
      userId: _,
      ...urlUpdated
    } = await this.prisma.url.update({
      where: { shortUrl },
      data: {
        originalUrl: body.url,
        accessCount: 0,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return {
      url: {
        ...urlUpdated,
        shortUrl: `${process.env.SHORTENER_BASE_URL}/${urlUpdated.shortUrl}`,
      },
      message: 'URL atualizada com sucesso, isso reseta o contador de acessos',
    };
  }

  async deleteUrl(shortUrl: string, userId: string) {
    const url = await this.prisma.url.findUnique({
      where: { shortUrl, deletedAt: null },
    });
    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }
    if (url.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar esta URL',
      );
    }
    await this.prisma.url.update({
      where: { shortUrl },
      data: {
        deletedAt: new Date(),
      },
    });
    return { message: 'URL deletada com sucesso' };
  }
}
