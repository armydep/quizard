import { Router } from 'express';
import * as usersController from '../controllers/usersController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.get('/me', authenticate, usersController.getMe);

export default router;
