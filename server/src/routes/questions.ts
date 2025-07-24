import { Router } from 'express';
import * as questionsController from '../controllers/questionsController';
import { authenticate } from '../middleware/authenticate';

const router = Router();


router.get('/random-question', authenticate, questionsController.getRandomQuestion);
router.post('/question-by-keyword', authenticate, questionsController.getQuestionByKeyword);
router.post('/submit-answer', authenticate, questionsController.submitAnswer);
router.post('/show-answer', authenticate, questionsController.showAnswer);

export default router;
