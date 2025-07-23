import { Router } from 'express';

const router = Router();

// Dummy questions for demonstration
const questions = [
  { question: 'What is the capital of France?', keywords: ['france', 'capital', 'paris'] },
  { question: 'Who wrote Hamlet?', keywords: ['shakespeare', 'hamlet', 'author'] },
  { question: 'What is the boiling point of water?', keywords: ['water', 'boiling', 'temperature'] },
];

// GET /api/random-question
router.get('/random-question', (_req, res) => {
  const random = questions[Math.floor(Math.random() * questions.length)];
  res.json({ question: random.question });
});

// POST /api/question-by-keyword
router.post('/question-by-keyword', (req, res) => {
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

// POST /api/submit-answer
router.post('/submit-answer', (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required.' });
  }
  // Find the question object
  const found = questions.find(q => q.question === question);
  if (!found) {
    return res.json({ correct: false });
  }
  // Simple answer check: for demo, accept if answer contains any keyword
  const isCorrect = found.keywords.some(k => answer.toLowerCase().includes(k.toLowerCase()));
  res.json({ correct: isCorrect });
});

export default router;
