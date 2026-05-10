import mongoose from "mongoose";


/*
Connect to mongodb via mongoose
*/

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return;
    }

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        isConnected = connectionInstance.connections[0].readyState === 1;
        console.log(`Mongodb connected successfully! DB connection host: ${connectionInstance.connection.host}`);
        
    } catch (error: any) {
        console.log("Mongodb connection error", error);
        throw error;
    }
}

//Graceful shutdown of mongodb connection

export const disconnectDB = async() =>{
    await mongoose.disconnect();
    console.log("Mongodb connection closed")
}
