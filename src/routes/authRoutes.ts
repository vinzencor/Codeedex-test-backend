import express from 'express';
import { register, login, getMe } from '../controllers/authController';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);

export default router;
