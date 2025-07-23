import { Request, Response } from 'express';
import Question from '../models/Question';

export async function getRandomQuestion(req: Request, res: Response) {
  res.setHeader('auth1', (req as any).isAuthenticated ? 'you are authenticated' : 'not authenticated');
  const count = await Question.countDocuments();
  if (count === 0) return res.json({ question: 'No questions available.' });
  const random = Math.floor(Math.random() * count);
  const q = await Question.findOne().skip(random);
  res.json({ question: q?.question || 'No question found.' });
}

export async function getQuestionByKeyword(req: Request, res: Response) {
  res.setHeader('auth1', (req as any).isAuthenticated ? 'you are authenticated' : 'not authenticated');
  const { keywords } = req.body;
  if (!Array.isArray(keywords)) {
    return res.status(400).json({ error: 'Keywords must be an array.' });
  }
  const q = await Question.findOne({ keywords: { $in: keywords } });
  if (q) {
    res.json({ question: q.question });
  } else {
    res.json({ question: 'No question found for those keywords.' });
  }
}

export async function submitAnswer(req: Request, res: Response) {
  res.setHeader('auth1', (req as any).isAuthenticated ? 'you are authenticated' : 'not authenticated');
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required.' });
  }
  const q = await Question.findOne({ question });
  if (!q) {
    return res.json({ correct: false });
  }
  // Accept if answer contains any keyword
  const isCorrect = q.keywords.some(k => answer.toLowerCase().includes(k.toLowerCase()));
  res.json({ correct: isCorrect });
}
