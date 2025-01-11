
import dotenv from 'dotenv'
import express from 'express'
import connectDb from './db/index.js';
import { app } from './app.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config();

app.use(cors());
app.use(express.json({limit:'16kb'}));// 
app.use(express.urlencoded({extended:true,limit:"16kb"}))// url se bhi data ayega uske liye h 
app.use(cookieParser());// cookies read karne ke liye
app.use(express.static("public"))
const port=process.env.PORT || 3001


/*
;(async()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("error",errro);
            throw error
        })
    } catch (error) {
        console.error(error);
        throw error
    }
})();
*/
connectDb()
.then(()=>{
    app.listen(port,()=>{
        console.log("server is running")
    })
})
.catch((err)=>{
    console.log("mongo db error")
})
