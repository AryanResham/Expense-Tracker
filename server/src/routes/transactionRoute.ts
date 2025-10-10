import {Router} from 'express';
import { verifySession } from '../middlewares/verifySession.js';

import {handleAddExpense, handleGetExpenses, handleDeleteExpense, handleUpdateExpense } from '../controllers/transactionController.js';

const router = Router();

router.use(verifySession);

router.get('/', handleGetExpenses);
router.post('/', handleAddExpense);
router.delete('/:id', handleDeleteExpense);
router.put('/:id', handleUpdateExpense);

export const expensesRoute = router;