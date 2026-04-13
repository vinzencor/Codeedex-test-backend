import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';

// Get all users (Scoped)
export const getUsers = async (req: any, res: Response) => {
  try {
    const { role, team, _id } = req.user;
    
    let query: any = {};

    if (role.scope === 'SELF') {
      query._id = _id;
    } else if (role.scope === 'TEAM') {
      if (!team) {
         query._id = _id; // fail-safe if no team assigned
      } else {
         query.team = team;
      }
    }
    // GLOBAL scope has no restrictions, query remains {}

    const users = await User.find(query)
      .populate('role')
      .populate('team')
      .select('-passwordHash');

    res.status(200).json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create User (Admin/Manager)
export const createUser = async (req: any, res: Response) => {
  try {
    const { name, email, password, roleId, teamId } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: roleId,
      team: teamId
    });

    res.status(201).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete User (Admin)
export const deleteUser = async (req: any, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, message: "User deleted" });
    } catch(err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}
