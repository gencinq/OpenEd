import { Router } from 'express';
import { QuestionsController } from './questions.controller';
import { AnswersController } from '../answers/answers.controller';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(QuestionsController.list));
router.post('/', requireAuth, asyncHandler(QuestionsController.create));
router.get('/:id', asyncHandler(QuestionsController.get));
router.delete('/:id', requireAuth, asyncHandler(QuestionsController.delete));

// Nested answer route: POST /questions/:id/answers
router.post('/:id/answers', requireAuth, asyncHandler(AnswersController.create));

export default router;
