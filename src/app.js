import express from 'express';

export const app = express();
app.use(express.json());

// Mock DB
const USERS = [{ id: 1, email: 'user@example.com', password: 'password123', name: 'Manoj' }];

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Returns mock JWT bearer token
  res.status(200).json({ token: 'mock-jwt-token-12345', userId: user.id });
});

// GET /api/profile (Protected Route)
app.get('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== 'Bearer mock-jwt-token-12345') {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  const user = USERS[0];
  res.status(200).json({ id: user.id, name: user.name, email: user.email });
});