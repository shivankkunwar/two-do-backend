import mongoose , {Schema, Document, Types, Mongoose} from "mongoose";

export interface ITodo extends Document{
    owner : Types.ObjectId,
    title: string,
    description?:string,
    status: "pending" | "completed",
    createdAt: Date,
    updatedAt: Date,
    dueDate?: Date,
}


const TodoSchema : Schema<ITodo> = new Schema ({
    owner : {type: Schema.Types.ObjectId, ref: "User", required: true},
    title: {type: String, required: true, trim: true},
    description: {type: String, default : ""},
    status : {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    dueDate: { type: Date },
    },
    {timestamps :true}
)

export default mongoose.model<ITodo>("Todo", TodoSchema)