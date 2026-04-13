import express from 'express';
import { getTeams } from '../controllers/teamController';
import { verifyToken } from '../middlewares/auth';
import { requirePermission } from '../middlewares/rbac';

const router = express.Router();

router.use(verifyToken);
router.get('/', requirePermission('teams:read'), getTeams);

export default router;
