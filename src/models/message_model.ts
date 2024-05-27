import mongoose from "mongoose";


interface IMessage {
    userId: string;
    chatId: string;
    content: string;
  }
  
const messageSchema = new mongoose.Schema<IMessage>({
    userId: {
        type: String,
        required: true,
    },
    chatId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model<IMessage>("Message", messageSchema);
