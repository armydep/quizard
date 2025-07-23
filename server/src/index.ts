import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from Express + TypeScript!' });
});

// Dummy questions for demonstration
const questions = [
  { question: 'What is the capital of France?', keywords: ['france', 'capital', 'paris'] },
  { question: 'Who wrote Hamlet?', keywords: ['shakespeare', 'hamlet', 'author'] },
  { question: 'What is the boiling point of water?', keywords: ['water', 'boiling', 'temperature'] },
];

// GET /api/random-question
app.get('/api/random-question', (_req, res) => {
  const random = questions[Math.floor(Math.random() * questions.length)];
  res.json({ question: random.question });
});

// POST /api/question-by-keyword
app.post('/api/question-by-keyword', (req, res) => {
  const { keywords } = req.body;
  if (!Array.isArray(keywords)) {
    return res.status(400).json({ error: 'Keywords must be an array.' });
  }
  // Find first question that matches any keyword
  const found = questions.find(q => q.keywords.some(k => keywords.includes(k)));
  if (found) {
    res.json({ question: found.question });
  } else {
    res.json({ question: 'No question found for those keywords.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});