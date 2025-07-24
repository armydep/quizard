import { Request, Response } from 'express';
import Question from '../models/Question';
import { randomUUID } from 'crypto';
import { QuestionsService } from '../services/questionsService';
export async function getRandomQuestion(req: Request, res: Response) {
  res.set('auth1', (req as any).isAuthenticated ? 'you are authenticated' : 'not authenticated');
  // Inject tracking_user_id cookie for anonymous users
  if (!(req as any).isAuthenticated) {
    let trackingId = (req as any).cookies?.tracking_user_id;
    if (!trackingId) {
      trackingId = randomUUID();
      res.cookie('tracking_user_id', trackingId, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
    }
  }
  const result = await QuestionsService.getRandomQuestion();
  // Store the question in MongoDB
  try {
    await Question.create(result);
  } catch (err) {
    console.error('Error saving question to MongoDB:', err);
  }
  res.json(result);
}

export async function getQuestionByKeyword(req: Request, res: Response) {
  res.set('auth1', (req as any).isAuthenticated ? 'you are authenticated' : 'not authenticated');
  // Inject tracking_user_id cookie for anonymous users
  if (!(req as any).isAuthenticated) {
    let trackingId = (req as any).cookies?.tracking_user_id;
    if (!trackingId) {
      trackingId = randomUUID();
      res.cookie('tracking_user_id', trackingId, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
    }
  }
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
  res.set('auth1', (req as any).isAuthenticated ? 'you are authenticated' : 'not authenticated');
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
