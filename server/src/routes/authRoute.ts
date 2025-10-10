import {Router} from 'express';
import {handleSessionLogin, handleSessionLogout, handleGetMe} from "../controllers/authController.js"
import { verifySession } from '../middlewares/verifySession.js';




const router = Router();

router.get('/me',verifySession ,handleGetMe);
router.post('/sessionLogin', handleSessionLogin);
router.post('/sessionLogout', verifySession, handleSessionLogout);

export const authRoutes = router;