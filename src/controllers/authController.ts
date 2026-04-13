import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Role from '../models/Role';
import '../models/Team'; // Required for .populate('team')
import '../models/Permission'; // Required for .populate('permissions')
import { createAuditLog } from '../middlewares/audit';

const generateToken = (id: string, roleName: string) => {
  return jwt.sign({ id, role: roleName }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // By default, assign to 'User' role if exists, this might be adjusted based on needs
    const defaultRole = await Role.findOne({ name: 'User' });
    if (!defaultRole) {
       return res.status(500).json({ success: false, message: 'System not fully initialized (missing default Role)' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: defaultRole._id
    });

    const populatedUser = await User.findById(user._id).populate('role');
    const token = generateToken(user._id.toString(), (populatedUser?.role as any).name);

    await createAuditLog('REGISTER', user._id, user._id, 'User');

    res.status(201).json({
      success: true,
      token,
      user: populatedUser
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: any = await User.findOne({ email }).populate({
        path: 'role',
        populate: { path: 'permissions' }
    }).populate('team');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString(), user.role.name);

    await createAuditLog('LOGIN', user._id, user._id, 'User');

    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    // req.user is set in auth middleware
    res.status(200).json({ success: true, user: req.user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
