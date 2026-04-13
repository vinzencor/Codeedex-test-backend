import { Request, Response } from 'express';
import Team from '../models/Team';

export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find();
    res.status(200).json({ success: true, teams });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
