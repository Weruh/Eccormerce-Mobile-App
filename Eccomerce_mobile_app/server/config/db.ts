import mongoose from "mongoose";


const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is not set");
    }

    // Only register listener once
    if (!mongoose.connection.listeners('connected').length) {
        mongoose.connection.on('connected', ()=>{
            console.log("MongoDB connected")
        })
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}

export default connectDB;