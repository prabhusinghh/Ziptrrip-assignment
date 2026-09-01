import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '32kb' }));

// API health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'todolist-rest-api' });
});

// REST resource routes
app.use('/api/todos', todoRoutes);

// Unknown API route
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Error handler
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Todo REST API running at http://localhost:${PORT}`);
});
