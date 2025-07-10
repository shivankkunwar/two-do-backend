import { Router } from "express";
import { getProfile } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.get("/", verifyToken, getProfile);

export default router; 