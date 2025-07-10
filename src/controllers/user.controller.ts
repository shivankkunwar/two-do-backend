import { Request, Response } from "express";
import { User } from "../models/User";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ email: user.email, userName: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
}; 