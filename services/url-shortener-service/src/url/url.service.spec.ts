import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

describe('UrlService', () => {
  let service: UrlService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    url: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shortenUrl', () => {
    const originalUrl = 'https://example.com';
    const shortId = 'abc123';
    const userId = '1';

    it('should create a shortened URL successfully with userId', async () => {
      mockPrismaService.url.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.url.create.mockResolvedValueOnce({
        shortUrl: shortId,
        originalUrl,
        userId,
      });

      const result = await service.shortenUrl(originalUrl, userId);

      expect(result).toEqual({
        shortUrl: expect.any(String),
        originalUrl,
        userId,
      });
    });

    it('should create a shortened URL successfully without userId', async () => {
      mockPrismaService.url.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.url.create.mockResolvedValueOnce({
        shortUrl: shortId,
        originalUrl,
      });

      const result = await service.shortenUrl(originalUrl);

      expect(result).toEqual({
        shortUrl: expect.any(String),
        originalUrl,
        message:
          'Autentique-se para ter acesso a benefícios como listar, atualizar e remover suas URLs encurtadas',
      });
      expect(mockPrismaService.url.create).toHaveBeenCalledWith({
        data: {
          originalUrl,
          shortUrl: expect.any(String),
          message:
            'Autentique-se para ter acesso a benefícios como listar, atualizar e remover suas URLs encurtadas',
        },
      });
    });

    it('should throw InternalServerErrorException after 10 failed attempts', async () => {
      mockPrismaService.url.findUnique.mockResolvedValue({ id: 1 });

      await expect(service.shortenUrl(originalUrl, userId)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockPrismaService.url.findUnique).toHaveBeenCalledTimes(10);
    });
  });

  describe('getOriginalUrl', () => {
    const shortUrl = 'abc123';
    const originalUrl = 'https://example.com';

    it('should return the original URL when found', async () => {
      mockPrismaService.url.findUnique.mockResolvedValueOnce({
        originalUrl,
        shortUrl,
      });

      const result = await service.getOriginalUrl(shortUrl);

      expect(result).toEqual({ originalUrl });
      expect(mockPrismaService.url.findUnique).toHaveBeenCalledWith({
        where: { shortUrl },
      });
    });

    it('should throw NotFoundException when URL is not found', async () => {
      mockPrismaService.url.findUnique.mockResolvedValueOnce(null);

      await expect(service.getOriginalUrl(shortUrl)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.url.findUnique).toHaveBeenCalledWith({
        where: { shortUrl },
      });
    });
  });
});
