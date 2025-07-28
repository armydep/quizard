import { Request, Response } from 'express';
import Question from '../models/Question';
import UsersQuestions from '../models/UsersQuestions';
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
  let savedQuestion = null;
  try {
    savedQuestion = await Question.create(result);
  } catch (err) {
    console.error('Error saving question to MongoDB:', err);
    return res.status(500).json({ error: 'Error saving question to MongoDB:', err });
  }

  // Store UsersQuestions entry
  try {
    const userId = (req as any).isAuthenticated ? (req as any).user?._id : undefined;
    const trackId = !userId ? (req as any).cookies?.tracking_user_id : undefined;
    await UsersQuestions.create({
      userId,
      trackId,
      questionId: savedQuestion.QuestionId,
      starttime: new Date(),
    });
    res.json(result);
  } catch (err) {
    console.error('Error saving UsersQuestions to MongoDB:', err);
    return res.status(500).json({ error: 'Error saving UsersQuestions to MongoDB:', err });
  }
  
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
    res.json({ question: q.Question });
  } else {
    res.json({ question: 'No question found for those keywords.' });
  }
}

export async function submitAnswer(req: Request, res: Response) {
  res.set('auth1', (req as any).isAuthenticated ? 'you are authenticated' : 'not authenticated');
  const { questionId, answer } = req.body;
  const userId = (req as any).isAuthenticated ? (req as any).user?._id : undefined;
  const trackId = !userId ? (req as any).cookies?.tracking_user_id : undefined;

  if (!questionId || !answer) {
    return res.status(400).json({ error: 'questionId and answer are required.' });
  }

  // Find the question in DB by questionId field
  console.log('QuestionId [' + questionId + ']');
const dbQuestion = await Question.findOne({ QuestionId: questionId });
  if (!dbQuestion) {
    return res.status(404).json({ error: 'Question not found.' });
  }

  // Find the UsersQuestions entry
  const userQuestionQuery: any = { questionId };
  if (userId) userQuestionQuery.userId = userId;
  else userQuestionQuery.trackId = trackId;

  let dbUserQuestion = await UsersQuestions.findOne(userQuestionQuery);

  if (!dbUserQuestion) {
    // If not found, create a new entry
    dbUserQuestion = new UsersQuestions({
      userId,
      trackId,
      questionId,
      starttime: new Date(),
      tries: 0
    });
  }

  // Increment tries
  dbUserQuestion.tries = (dbUserQuestion.tries || 0) + 1;

  // Semantic answer check via answer-evaluator service
  let isCorrect = false;
  let similarity = 0;
  try {
    const evalRes = await fetch('http://localhost:8000/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expected: dbQuestion.Answer, userAnswer: answer })
    });
    const evalData = await evalRes.json();
    isCorrect = !!evalData.isCorrect;
    similarity = evalData.similarity;
  } catch (err) {
    console.error('Error calling answer-evaluator:', err);
    // fallback to string match if evaluator fails
    isCorrect = (answer.trim().toLowerCase() === (dbQuestion.Answer || '').trim().toLowerCase());
    similarity = isCorrect ? 1 : 0;
  }
  dbUserQuestion.iscorrect = isCorrect;
  dbUserQuestion.endtime = new Date();
  await dbUserQuestion.save();
  if (isCorrect) {
    let timeTaken = 0;
    if (dbUserQuestion.starttime && dbUserQuestion.endtime) {
      timeTaken = Math.round((dbUserQuestion.endtime.getTime() - dbUserQuestion.starttime.getTime()) / 1000);
    }
    return res.json({ correct: true, time: timeTaken, tries: dbUserQuestion.tries, similarity });
  } else {
    return res.json({ correct: false, similarity });
  }
}

export async function showAnswer(req: Request, res: Response) {
  const { questionId } = req.body;
  if (!questionId) {
    return res.status(400).json({ error: 'questionId is required.' });
  }
  const dbQuestion = await Question.findOne({ QuestionId: questionId });
  if (!dbQuestion) {
    return res.status(404).json({ error: 'Question not found.' });
  }
  return res.json({ answer: dbQuestion.Answer || '' });
}

export async function showComments(req: Request, res: Response) {
  const { questionId } = req.body;
  if (!questionId) {
    return res.status(400).json({ error: 'questionId is required.' });
  }
  const dbQuestion = await Question.findOne({ QuestionId: questionId });
  if (!dbQuestion) {
    return res.status(404).json({ error: 'Question not found.' });
  }
  return res.json({ comments: dbQuestion.Comments || 'N/A' });
}

export async function likeQuestion(req: Request, res: Response) {
  const { questionId, action } = req.body;
  if (!questionId || !['like', 'dislike'].includes(action)) {
    return res.status(400).json({ error: 'questionId and valid action are required.' });
  }
  const updateField = action === 'like' ? { $inc: { _likes: 1 } } : { $inc: { _dislikes: 1 } };
  const updated = await Question.findOneAndUpdate(
    { QuestionId: questionId },
    updateField,
    { new: true }
  );
  if (!updated) {
    return res.status(404).json({ error: 'Question not found.' });
  }
  return res.json({ success: true, _likes: updated._likes, _dislikes: updated._dislikes });
}