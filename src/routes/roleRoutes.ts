import express from 'express';
import { getRoles, createRole, updateRole, getPermissions } from '../controllers/roleController';
import { verifyToken } from '../middlewares/auth';
import { requirePermission, requireScopeOrGlobal } from '../middlewares/rbac';
import { logAudit } from '../middlewares/audit';

const router = express.Router();

router.use(verifyToken);
// Only Global Admins can access roles and permissions
router.use(requireScopeOrGlobal('GLOBAL'));

router.get('/', requirePermission('roles:read'), getRoles);
router.post('/', requirePermission('roles:create'), logAudit('CREATE_ROLE', (req, res) => res.locals?.role?._id, 'Role'), createRole);
router.put('/:id', requirePermission('roles:update'), logAudit('UPDATE_ROLE', (req) => req.params.id, 'Role'), updateRole);
router.get('/permissions', requirePermission('roles:read'), getPermissions);

export default router;
