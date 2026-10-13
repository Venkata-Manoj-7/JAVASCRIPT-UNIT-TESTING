import { http, HttpResponse } from 'msw';

export const handlers = [
  // Intercept GET requests to /api/products
  http.get('https://api.example.com/products', () => {
    return HttpResponse.json([
      { id: 1, name: 'Wireless Mouse', price: 29.99 },
      { id: 2, name: 'Mechanical Keyboard', price: 89.99 },
    ]);
  }),

  // Intercept POST requests to /api/checkout
  http.post('https://api.example.com/checkout', async ({ request }) => {
    const body = await request.json();

    if (!body.cartId) {
      return HttpResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      status: 'success',
      transactionId: 'TXN_998877',
    });
  }),
];    

