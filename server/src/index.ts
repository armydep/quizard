

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import questionsRouter from './routes/questions';
import usersRouter from './routes/users';


const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizard';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', questionsRouter);
app.use('/api/users', usersRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});