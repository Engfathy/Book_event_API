import { Mode } from "fs";
import mongoose, { Document, Schema } from "mongoose";

interface Events extends Document {
    _id?: string;
    name: string;
    image: string;
    price: number;
    date: Date;
    info: string;
    type: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the user schema
const userSchema: Schema = new mongoose.Schema<Events>(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        date: { type: Date, required: true },
        info: { type: String, required: true },
        type: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }, // Enable timestamps for createdAt and updatedAt
);

// Create the User model
const Events = mongoose.model<Events>("Events", userSchema);

export default Events;
