import express from 'express';

export const app = express();
app.use(express.json());

// Sample Endpoints
app.get('/api/users', (req, res) => {
  res.status(200).json([
    { id: 1, name: 'Manoj', role: 'Developer' }
  ]);
});

app.post('/api/users', (req, res) => {
  const { name, role } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  res.status(201).json({
    id: Date.now(),
    name,
    role: role || 'Member'
  });
});