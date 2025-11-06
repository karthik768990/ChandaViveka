import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import chandasRoutes from './routes/chandas.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chandas', chandasRoutes);

// Health route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

export default app;
