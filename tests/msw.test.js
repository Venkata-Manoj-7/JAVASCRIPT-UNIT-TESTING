import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/server.js';

// 1. Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// 2. Reset handlers after each test (clears runtime overrides)
afterEach(() => server.resetHandlers());

// 3. Clean up and close server after all tests finish
afterAll(() => server.close());

describe('MSW Network Mocking Suite', () => {

  it('fetches product catalog via network interception', async () => {
    const res = await fetch('https://api.example.com/products');
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].name).toBe('Wireless Mouse');
  });

  it('handles server 500 errors using runtime override (server.use)', async () => {
    // Override handler specifically for this test case
    server.use(
      http.get('https://api.example.com/products', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const res = await fetch('https://api.example.com/products');
    expect(res.status).toBe(500);
  });

});