import {Router} from 'express';
import { verifySession } from '../middlewares/verifySession.js';
import { handleAddCategory, handleGetCategories, handleGetSystemCategories } from '../controllers/categoriesController.js';

const router = Router();

// No auth needed for system categories
router.get('/system', handleGetSystemCategories);

// Auth required for user categories
router.use(verifySession);
router.get('/', handleGetCategories);
router.post('/', handleAddCategory);

export const categoriesRoute = router;