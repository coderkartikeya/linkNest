import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv'

dotenv.config();

const connectDb=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n mongodb content :${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("error",error);
        throw error
    }
}

export default connectDb;