import { Router } from 'express';
import { NotesController } from './notes.controller';
import { requireAuth, optionalAuth } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.get('/', optionalAuth, asyncHandler(NotesController.list));
router.post('/', requireAuth, asyncHandler(NotesController.create));
router.get('/:id', optionalAuth, asyncHandler(NotesController.get));
router.put('/:id', requireAuth, asyncHandler(NotesController.update));
router.delete('/:id', requireAuth, asyncHandler(NotesController.delete));

export default router;
