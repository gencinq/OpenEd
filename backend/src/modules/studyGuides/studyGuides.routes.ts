import { Router } from 'express';
import { StudyGuidesController } from './studyGuides.controller';
import { requireAuth, optionalAuth } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.get('/', optionalAuth, asyncHandler(StudyGuidesController.list));
router.post('/', requireAuth, asyncHandler(StudyGuidesController.create));
router.get('/:id', optionalAuth, asyncHandler(StudyGuidesController.get));
router.put('/:id', requireAuth, asyncHandler(StudyGuidesController.update));
router.delete('/:id', requireAuth, asyncHandler(StudyGuidesController.delete));

export default router;
