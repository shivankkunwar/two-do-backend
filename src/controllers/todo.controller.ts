import { Request, Response } from "express";
import { Types } from "mongoose";
import Todo, { ITodo } from "../models/Todo";
import { ensureObjectId, checkOwner } from "../utils/ownership";

type AuthReq = Request & { userId: string };

export const createTodo = async (req: AuthReq, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const todo = new Todo({
      owner: req.userId,
      title,
      description,
      status,
    });
    await todo.save();
    res.status(201).json({ data: todo });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const listTodos = async (req: AuthReq, res: Response) => {
  try {
    const filter : any = {owner: req.userId}

    const {status} = req.query;
    if(status === "pending" || status === "completed"){
        filter.status = status;
    }
    const todos = await Todo.find(filter).sort({createdAt: -1})
    res.json({data: todos})
  } catch (err) {

    res.status(500).json({error: "Server error"})
  }
};


export const updateTodo = async (req: AuthReq, res: Response)=>{
    try{
        const {id} = req.params;
        const todoId = ensureObjectId(id, res);
        if(!todoId) return;

        const todo = await Todo.findById(todoId);
        if(!todo){
            return res.status(404).json({error: "not found"})
        }
        if(!checkOwner(todo.owner, req.userId, res)) return;

        const { title, description, status} = req.body;

        if(title !== undefined ) todo.title = title;
        if(description!=undefined) todo.description=description;
        if(status === 'pending' || status === "completed")
            todo.status = status

        await todo.save()
        res.json({data: todo})
    }catch(err){
        res.status(500).json({error: "server error"})
    }
}

export const deleteTodo = async (req:AuthReq, res: Response)=>{
    try{
        const { id} = req.params;
        const todoId = ensureObjectId(id,res)
        if(!todoId)return;

        const todo = await Todo.findById(todoId);
        if(!todo){
            return res.status(404).json({error: "Not found"})
        }

        if(!checkOwner(todo.owner, req.userId, res))return;

        await Todo.deleteOne({ _id: todoId });
        res.json({data: {id: todoId}})
    }catch(err){

        res.status(500).json({error: "server error"})
    }
}
