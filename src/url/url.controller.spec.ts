import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Response } from 'express';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: UrlService;

  const mockUrlService = {
    shortenUrl: jest.fn(),
    getOriginalUrl: jest.fn(),
  };

  const mockResponse = {
    redirect: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    urlService = module.get<UrlService>(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('shortenUrl', () => {
    const createUrlDto = { url: 'https://example.com' };
    const shortenedUrl = {
      shortUrl: 'abc123',
      originalUrl: 'https://example.com',
    };

    it('should creat a shortened URL', async () => {
      mockUrlService.shortenUrl.mockResolvedValueOnce(shortenedUrl);

      const result = await controller.shortenUrl(createUrlDto);

      expect(result).toEqual(shortenedUrl);
      expect(mockUrlService.shortenUrl).toHaveBeenCalledWith(createUrlDto.url);
    });
  });

  describe('redirectToOriginalUrl', () => {
    const shortUrl = 'abc123';
    const originalUrl = 'https://example.com';

    it('should redirect to the original URL', async () => {
      mockUrlService.getOriginalUrl.mockResolvedValueOnce({ originalUrl });

      await controller.redirectToOriginalUrl(mockResponse, shortUrl);

      expect(mockUrlService.getOriginalUrl).toHaveBeenCalledWith(shortUrl);
      expect(mockResponse.redirect).toHaveBeenCalledWith(301, originalUrl);
    });

    it('should propagate errors from urlService', async () => {
      const error = new Error('URL not found');
      mockUrlService.getOriginalUrl.mockRejectedValueOnce(error);

      await expect(
        controller.redirectToOriginalUrl(mockResponse, shortUrl),
      ).rejects.toThrow(error);

      expect(mockUrlService.getOriginalUrl).toHaveBeenCalledWith(shortUrl);
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });
  });
});
