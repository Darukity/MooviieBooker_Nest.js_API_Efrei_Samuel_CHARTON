import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App E2E Tests', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: number;
  let reservationId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import the full application module
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ✅ AUTH TESTS
  let email = `test+${Date.now()}@example.com`; // ✅ Change email dynamically
  describe('Auth', () => {
    it('should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testUser',
          email: email, // ✅ Change email dynamically
          password: 'password123',
          role: 'user',
        })
        .expect(201);
  
      expect(res.body).toHaveProperty('message', 'User successfully added');
      userId = res.body.id;
    });

    it('should login and return JWT token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: email,
          password: 'password123'
        })
        .expect(201); // 🔹 Change 200 to 201 to match the actual response
    
      expect(res.body).toHaveProperty('access_token');
      authToken = res.body.access_token;
    });
    
    it('should get now playing movies', async () => {
      const res = await request(app.getHttpServer())
        .get('/movies/now_playing')
        .expect(200);
    
      //console.log('Movies Response:', res.body); // ✅ Debug response
    
      expect(Array.isArray(res.body.results)).toBe(true); // ✅ Fix here
    });
    
  });

  // // ✅ MOVIES TESTS
  describe('Movies', () => {
    it('should get now playing movies', async () => {
      const res = await request(app.getHttpServer())
        .get('/movies/now_playing')
        .expect(200);
  
      expect(Array.isArray(res.body.results)).toBe(true); // ✅ Fix here
    });
  
    it('should search for movies', async () => {
      const res = await request(app.getHttpServer())
        .get('/movies/movies?page=1&search={"query": "Harry"}')
        .expect(200);
  
      expect(Array.isArray(res.body.results)).toBe(true); // ✅ Fix here
    });
  
    it('should get a list of genres', async () => {
      const res = await request(app.getHttpServer())
        .get('/movies/genres')
        .expect(200);
  
      expect(Array.isArray(res.body.genres)).toBe(true); // ✅ Fix here
    });
  });
  

  // // ✅ RESERVATION TESTS
  describe('Reservations', () => {
    it('should create a reservation', async () => {
      const res = await request(app.getHttpServer())
        .post('/reservation/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ movie_id: 3, reservation_begins: new Date().toISOString() })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      reservationId = res.body.id;
    });

    it('should return reservations for the logged-in user', async () => {
      const res = await request(app.getHttpServer())
        .get('/reservation/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should delete a reservation', async () => {
      await request(app.getHttpServer())
        .delete(`/reservation/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should return 401 if no token is provided', async () => {
      await request(app.getHttpServer())
        .delete(`/reservation/reservations/${reservationId}`)
        .expect(401);
    });
  });
});