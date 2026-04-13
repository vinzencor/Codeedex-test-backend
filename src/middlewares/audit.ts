import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import AuditLog from '../models/AuditLog';

// Helper function to create an audit log directly
export const createAuditLog = async (action: string, actor: any, target: any, targetModel: string, details?: any) => {
  try {
    await AuditLog.create({
      action,
      actor,
      target,
      targetModel,
      details
    });
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};

// Middleware version (logs after response finishes successfully)
export const logAudit = (action: string, getTargetId?: (req: any, res: any) => any, targetModel?: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const target = getTargetId ? getTargetId(req, res) : undefined;
        // Basic detail capture: just store req body minus passwords
        const details = { ...req.body };
        if (details.password) delete details.password;

        if (req.user) {
            createAuditLog(action, req.user._id, target, targetModel || 'Unknown', details);
        }
      }
    });
    next();
  };
};
