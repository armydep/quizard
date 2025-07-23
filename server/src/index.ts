
import express from 'express';
import cors from 'cors';
import questionsRouter from './routes/questions';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', questionsRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});