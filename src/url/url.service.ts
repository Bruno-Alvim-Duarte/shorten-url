import { Injectable } from '@nestjs/common';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UrlService {
  private readonly nanoid = customAlphabet(urlAlphabet, 6);

  constructor(private readonly prisma: PrismaService) {}

  async shortenUrl(
    url: string,
  ): Promise<{ shortUrl: string; originalUrl: string }> {
    let shortId: string;
    let existingUrl: any;

    do {
      shortId = this.nanoid();
      existingUrl = await this.prisma.url.findUnique({
        where: { shortUrl: shortId },
      });
    } while (existingUrl);

    await this.prisma.url.create({
      data: {
        originalUrl: url,
        shortUrl: shortId,
      },
    });

    return { shortUrl: shortId, originalUrl: url };
  }

  async getOriginalUrl(shortUrl: string): Promise<{ originalUrl: string }> {
    const url = await this.prisma.url.findUnique({
      where: { shortUrl },
    });
    return { originalUrl: url.originalUrl };
  }
}
