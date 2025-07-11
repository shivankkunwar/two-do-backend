import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.JWT_SECRET ?? "secret",
    (err: Error | null, decoded: string | JwtPayload | undefined) => {
      if (err) return res.status(401).json({ error: "Unauthorized" });
      (req as any).user = decoded;
      (req as any).userId = (decoded as any)?.userId;
      next();
    }
  );
}; 