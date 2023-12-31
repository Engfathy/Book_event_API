import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the user document
interface User extends Document {
    _id?: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    isAdmin: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the user schema
const userSchema: Schema = new mongoose.Schema<User>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, required: true },
        isAdmin: { type: Boolean, required: false, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }, // Enable timestamps for createdAt and updatedAt
);

// Create the User model
const User = mongoose.model<User>("User", userSchema);

export default User;
