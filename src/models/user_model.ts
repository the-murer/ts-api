import mongoose from "mongoose";


interface IUser {
    name: string;
    email: string;
    active: boolean;
    password: string;
  }
  
const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    active: {
        type: Boolean,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);
