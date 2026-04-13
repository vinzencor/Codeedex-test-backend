import express, { Request, Response } from 'express';
import AuditLog from '../models/AuditLog';
import { verifyToken } from '../middlewares/auth';
import { requirePermission, requireScopeOrGlobal } from '../middlewares/rbac';

const router = express.Router();

router.use(verifyToken);
router.use(requireScopeOrGlobal('GLOBAL')); // Only global admins can view audits

router.get('/', requirePermission('audit:read'), async (req: Request, res: Response) => {
    try {
        const logs = await AuditLog.find().sort({ createdAt: -1 }).populate('actor', 'name email').limit(100);
        res.status(200).json({ success: true, logs });
    } catch(err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
