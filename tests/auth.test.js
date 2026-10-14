import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Auth & Protected Profile API Integration', () => {

  describe('POST /api/login', () => {
    it('returns 200 OK and bearer token on valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ email: 'user@example.com', password: 'password123' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('token', 'mock-jwt-token-12345');
      expect(response.body).toHaveProperty('userId', 1);
    });

    it('returns 400 Bad Request when password is missing', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ email: 'user@example.com' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Email and password are required'
      });
    });

    it('returns 401 Unauthorized on invalid password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ email: 'user@example.com', password: 'wrongpassword' })
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/profile (Protected Header)', () => {
    it('returns 401 Unauthorized when Authorization header is missing', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect(401);

      expect(response.body.error).toBe('Unauthorized access');
    });

    it('returns 200 OK with user profile when valid Bearer token is passed', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer mock-jwt-token-12345') // Custom Request Header
        .expect(200);

      expect(response.body).toEqual({
        id: 1,
        name: 'Manoj',
        email: 'user@example.com'
      });
    });
  });

});