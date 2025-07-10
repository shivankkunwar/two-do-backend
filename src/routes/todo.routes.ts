import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import {
  createTodo,
  listTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller";

const router = Router();

router.use(verifyToken);

router.post("/", createTodo);
router.get("/", listTodos);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
