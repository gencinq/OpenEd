import { Router } from 'express';
import { UsersController } from './users.controller';
import { requireAuth, requireAdmin } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// User profile routes
router.get('/:id', asyncHandler(UsersController.getProfile));
router.put('/:id', requireAuth, asyncHandler(UsersController.updateProfile));

// Admin routes (mounted under /api/admin in app.ts, but user-related and moderation can sit here in the routes)
// Note: We will export adminRouter separately or configure in app.ts directly. Let's create an admin router too.
export const adminRouter = Router();
adminRouter.get('/users', requireAdmin, asyncHandler(UsersController.listAllUsers));
adminRouter.delete('/content/:type/:id', requireAdmin, asyncHandler(UsersController.moderateDelete));

export default router;
