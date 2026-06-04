import { Router } from 'express';
import { SearchController } from './search.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(SearchController.search));

export default router;
