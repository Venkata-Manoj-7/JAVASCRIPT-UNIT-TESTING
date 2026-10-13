import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('API Endpoint Integration Suite (Supertest)', () => {

  describe('GET /api/users', () => {
    it('returns 200 OK with list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('name', 'Manoj');
    });
  });

  describe('POST /api/users', () => {
    it('creates a new user with 201 Created status', async () => {
      const newUser = { name: 'Alex', role: 'Tester' };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Alex');
      expect(response.body.role).toBe('Tester');
    });

    it('returns 400 Bad Request when required field is missing', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        error: 'Name is required'
      });
    });
  });

});