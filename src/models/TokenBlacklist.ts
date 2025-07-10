import mongoose, { Schema, Document } from "mongoose";

export interface ITokenBlacklist extends Document {
  token: string;
  expiresAt: Date;
}

const TokenBlacklistSchema: Schema<ITokenBlacklist> = new Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index – document removed when expiresAt is reached
    },
  },
  { timestamps: false }
);

export default mongoose.model<ITokenBlacklist>(
  "TokenBlacklist",
  TokenBlacklistSchema
); 