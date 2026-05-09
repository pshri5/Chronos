import mongoose from "mongoose";


/*
Connect to mongodb via mongoose
*/

let isConnected = false;

export const connectDB = async() =>{
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }
    
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        isConnected = connectionInstance.connections[0].readyState === 1;
        console.log(`Mongodb connected successfully! DB connection host: ${connectionInstance.connection.host}`)
        
    } catch (error: any) {
        console.log("Mongodb connection error",error)
        throw new Error("Database connection failed");
    }
}

//Graceful shutdown of mongodb connection

export const disconnectDB = async() =>{
    await mongoose.disconnect();
    console.log("Mongodb connection closed")
}
