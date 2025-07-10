import {Types} from 'mongoose'
import { Response, Request, NextFunction} from "express"

export function ensureObjectId(id:string, res:Response ): Types.ObjectId | null{

    if(!Types.ObjectId.isValid(id)){
        res.status(400).json({error: "Invalid ID format"})
        return null;
    }

    return new Types.ObjectId(id)

}


export function checkOwner(resourceOwner: Types.ObjectId, userId: string, res: Response): boolean{
    if(resourceOwner.toString() !==userId){
        res.status(403).json({error: "forbidden"})
        return false
    }
    return true
}