import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requirePermission = (requiredPermission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { role } = req.user;
    if (!role || !role.permissions) {
      return res.status(403).json({ success: false, message: 'Access denied: No permissions found' });
    }

    const hasPermission = role.permissions.some((p: any) => p.name === requiredPermission);

    if (hasPermission) {
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Access denied: Missing required permission' });
    }
  };
};

export const requireScopeOrGlobal = (scopeRequired: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
       if (!req.user) {
         return res.status(401).json({ success: false, message: 'User not authenticated' });
       }
   
       const { role } = req.user;
       if (role.scope === 'GLOBAL') {
           return next();
       }
       if (role.scope === scopeRequired || role.scope === 'TEAM') { 
           // If requiring SELF, and user has TEAM, they usually can do it. Adjust logic based on specific endpoints.
           return next();
       }

       return res.status(403).json({ success: false, message: 'Access denied: Insufficient scope' });
  }
}
