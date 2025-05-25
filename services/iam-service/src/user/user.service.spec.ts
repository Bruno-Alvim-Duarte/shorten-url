import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@testing.com',
        password: 'passwordTest',
        name: 'Test User',
      };

      const hashedPassword = 'hashedpasswordTest';
      const expectedUser = {
        id: '1',
        ...createUserDto,
        password: hashedPassword,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should throw BadRequestException when user with email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@testing.com',
        password: 'passwordTest',
        name: 'Test User',
      };

      const existingUser = {
        id: '1',
        email: createUserDto.email,
        name: 'Existing User',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );
    });
  });

  describe('findAll', () => {
    it('should return all active users', async () => {
      const expectedUsers = [
        {
          id: '1',
          email: 'test@testing.com',
          name: 'Test User',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(expectedUsers);

      const result = await service.findAll();

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        select: {
          id: true,
          email: true,
          name: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const expectedUser = {
        id: userId,
        email: 'test@testing.com',
        name: 'Test User',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(expectedUser);

      const result = await service.findOne(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(expectedUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const expectedUser = {
        id: userId,
        email: 'test@testing.com',
        name: 'Updated Name',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(expectedUser);

      const result = await service.update(userId, updateUserDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          name: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should hash password when updating password', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        password: 'newpasswordTest',
      };
      const hashedPassword = 'hashedNewpasswordTest';

      const expectedUser = {
        id: userId,
        email: 'test@testing.com',
        name: 'Test User',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.update.mockResolvedValue(expectedUser);

      await service.update(userId, updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(updateUserDto.password, 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { password: hashedPassword },
        select: {
          id: true,
          email: true,
          name: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      const userId = '1';
      const expectedUser = {
        id: userId,
        deletedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(expectedUser);

      const result = await service.remove(userId);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          deletedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(expectedUser);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const plainTextPassword = 'passwordTest';
      const hashedPassword = 'hashedpasswordTest';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validatePassword(
        plainTextPassword,
        hashedPassword,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainTextPassword,
        hashedPassword,
      );
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const plainTextPassword = 'wrongPassword';
      const hashedPassword = 'hashedpasswordTest';

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validatePassword(
        plainTextPassword,
        hashedPassword,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainTextPassword,
        hashedPassword,
      );
      expect(result).toBe(false);
    });
  });
});
