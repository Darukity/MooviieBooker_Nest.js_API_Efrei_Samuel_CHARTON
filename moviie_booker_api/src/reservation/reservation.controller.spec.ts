import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import * as request from 'supertest';

describe('ReservationController (Integration)', () => {
  let app: INestApplication;
  let reservationService: ReservationService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            registerReservation: jest.fn().mockResolvedValue({ id: 1, movie_id: 3 }),
            getReservations: jest.fn().mockResolvedValue([{ id: 1, movie_id: 3 }]),
            deleteReservations: jest.fn().mockResolvedValue({ success: true }), // ✅ Ensure this is properly mocked
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue({ sub: 1 }), // ✅ Ensure JWT verification always returns a valid user ID
          },
        },
      ],
    }).compile();
  
    app = moduleFixture.createNestApplication();
    reservationService = moduleFixture.get<ReservationService>(ReservationService);
    await app.init();
  });  

  afterAll(async () => {
    await app.close();
  });

  it('POST /reservation/reservations should return 201 when valid data is provided', async () => {
    return request(app.getHttpServer())
      .post('/reservation/reservations')
      .set('Authorization', 'Bearer valid_token')
      .send({ movie_id: 3, reservation_begins: new Date().toISOString() })
      .expect(201)
      .expect({ id: 1, movie_id: 3 });
  });

  it('should return success on deletion', async () => {
    return request(app.getHttpServer())
      .delete('/reservation/reservations/1')
      .set('Authorization', 'Bearer valid_token') // ✅ Use a valid token
      .expect(200)
      .expect({ success: true });
  });
});
