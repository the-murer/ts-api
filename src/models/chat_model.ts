import mongoose from "mongoose";


interface IChat {
    participants: Array<string>;
  }
  
const chatSchema = new mongoose.Schema<IChat>({ participants: Array }, { timestamps: true });

export default mongoose.model<IChat>("Chat", chatSchema);
