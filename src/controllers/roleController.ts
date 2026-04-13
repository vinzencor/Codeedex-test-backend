import { Request, Response } from 'express';
import Role from '../models/Role';
import Permission from '../models/Permission';

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.status(200).json({ success: true, roles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRole = async (req: Request, res: Response) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json({ success: true, role });
    } catch(err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const updateRole = async (req: Request, res: Response) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
        res.status(200).json({ success: true, role });
    } catch(err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const getPermissions = async (req: Request, res: Response) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json({ success: true, permissions });
    } catch(err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}
