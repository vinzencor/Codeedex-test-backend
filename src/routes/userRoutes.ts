import express from 'express';
import { getUsers, createUser, deleteUser } from '../controllers/userController';
import { verifyToken } from '../middlewares/auth';
import { requirePermission } from '../middlewares/rbac';
import { logAudit } from '../middlewares/audit';

const router = express.Router();

router.use(verifyToken);

router.get('/', requirePermission('users:read'), getUsers);
router.post(
  '/', 
  requirePermission('users:create'), 
  logAudit('CREATE_USER', (req, res) => res.locals?.newUser?._id, 'User'),
  createUser
);
router.delete(
  '/:id', 
  requirePermission('users:delete'), 
  logAudit('DELETE_USER', (req, res) => req.params.id, 'User'),
  deleteUser
);

export default router;
