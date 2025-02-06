import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt'; // ✅ Import JwtService
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock_token'), // ✅ Mock JWT sign method
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService, // ✅ Provide mock JwtService
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService); // ✅ Assign jwtService
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user and return it', async () => {
      const userDto = { email: 'test@example.com', username: 'testUser', password: 'password123', role: 'user' };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      userRepository.create.mockReturnValue(userDto as User);
      userRepository.save.mockResolvedValue({ id: 1, ...userDto } as User);

      const result = await service.register(userDto);
      expect(result).toEqual({ message: "User successfully added" });
      expect(userRepository.create).toHaveBeenCalledWith(userDto);
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return a JWT token if credentials are valid', async () => {
      const userDto = { email: 'test@example.com', password: 'password123' };
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' } as User;

      userRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.login(userDto);
      expect(result).toHaveProperty('access_token', 'mock_token'); // ✅ Now it should work
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const userDto = { email: 'test@example.com', password: 'wrongpassword' };
      userRepository.findOne.mockResolvedValue({ id: 1, email: 'test@example.com', password: 'hashedPassword' } as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login(userDto)).rejects.toThrow('Incorrect password or email');
    });
  });
});
