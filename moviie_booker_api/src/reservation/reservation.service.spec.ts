import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { User } from '../entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { BookReservation } from './dto/bookReservation.dto';

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: Repository<Reservation>;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: JwtService,
          useValue: { verify: jest.fn() },
        },
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(), // ✅ Add this to fix the error
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerReservation', () => {
    it('should create a reservation if valid token is provided', async () => {
        const mockUser = { id: 1 } as User;
        const mockReservation = { 
            id: 1, 
            user: mockUser, 
            movie_id: 3, 
            reservation_begins: new Date('2025-02-06') 
        } as Reservation;

        jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 1 });
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(reservationRepository, 'find').mockResolvedValue([]); // Ensure it returns an empty array
        jest.spyOn(reservationRepository, 'create').mockReturnValue(mockReservation); // ✅ Ensure `create()` returns an object
        jest.spyOn(reservationRepository, 'save').mockResolvedValue(mockReservation);

        const result = await service.registerReservation(
            { movie_id: 3, reservation_begins: new Date('2025-02-06') } as BookReservation,
            'Bearer valid_token'
        );

        expect(result).toEqual(mockReservation);
    });
  });


  describe('getReservations', () => {
    it('should return user reservations', async () => {
      const mockReservations = [
        { id: 1, user: { id: 1 }, movie_id: 3, reservation_begins: new Date('2025-02-06') } as Reservation,
      ];

      jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 1 });
      jest.spyOn(reservationRepository, 'find').mockResolvedValue(mockReservations);

      const result = await service.getReservations('Bearer valid_token');
      expect(result).toEqual(mockReservations);
    });
  });

  describe('deleteReservations', () => {
    it('should throw UnauthorizedException if user is not owner', async () => {
        jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 2 });
        jest.spyOn(reservationRepository, 'findOne').mockResolvedValue({ id: 1, user: { id: 1 } } as Reservation);

        await expect(service.deleteReservations(1, 'Bearer valid_token'))
            .rejects.toThrow(UnauthorizedException);
    });

    it('should delete reservation if user is owner', async () => {
        jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 1 });
        jest.spyOn(reservationRepository, 'findOne').mockResolvedValue({ id: 1, user: { id: 1 } } as Reservation);
        jest.spyOn(reservationRepository, 'delete').mockResolvedValue({ affected: 1 } as any); // Ensure it returns { affected: 1 }

        const result = await service.deleteReservations(1, 'Bearer valid_token');
        expect(result).toEqual({ success: true });
    });
});

});
