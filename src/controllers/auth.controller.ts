import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/TokenBlacklist";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";
const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, userName } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username: userName, password: hash });
    await newUser.save();

    // issue tokens
    const accessToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: ACCESS_TTL,
    });
    const refreshToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: REFRESH_TTL,
    });

    setRefreshCookie(res, refreshToken);

    res.status(201).json({ token: accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password!);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: ACCESS_TTL,
    });

    const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: REFRESH_TTL,
    });
    setRefreshCookie(res, refreshToken);

    res.json({ token: accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const decoded: any = jwt.decode(token);
      if (decoded && decoded.exp) {
        const expiresAt = new Date(decoded.exp * 1000);
        await TokenBlacklist.create({ token, expiresAt });
      }
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: "Unauthenticated" });

    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) return res.status(401).json({ error: "Token revoked" });

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }

    const accessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, {
      expiresIn: ACCESS_TTL,
    });

    res.json({ token: accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
} 