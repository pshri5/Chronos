import mongoose from "mongoose";


/*
Connect to mongodb via mongoose
*/

export const connectDB = async() =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`Mongodb connected successfully! DB connection host: ${connectionInstance.connection.host}`)
        
    } catch (error: any) {
        console.log("Mongodb connection error",error)
        process.exit(1)
    }
}

//Graceful shutdown of mongodb connection

export const disconnectDB = async() =>{
    await mongoose.disconnect();
    console.log("Mongodb connection closed")
}
