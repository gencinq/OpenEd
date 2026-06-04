import { Router } from 'express';
import { AnswersController } from './answers.controller';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.post('/:id/upvote', requireAuth, asyncHandler(AnswersController.upvote));
router.post('/:id/accept', requireAuth, asyncHandler(AnswersController.accept));

export default router;
