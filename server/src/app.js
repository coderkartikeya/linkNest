import dotenv from 'dotenv'
import express from 'express'
import connectDb from './db/index.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config();

const app=express();
const allowedOrigins = ['http://localhost:3000', 'https://link-nest-frontend-chi.vercel.app/'];
app.use(cors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));
app.use(express.json({limit:'16kb'}));// 
app.use(express.urlencoded({extended:true,limit:"16kb"}))// url se bhi data ayega uske liye h 
app.use(cookieParser());// cookies read karne ke liye
app.use(express.static("public"))

import useRouter from './routes/user.routes.js'
import useCommunity from './routes/community.routes.js'
import useMessages from './routes/message.routes.js'
// routes /api/version/kahan janan h 
app.use("/api/v1/users",useRouter);
app.use("/api/v1/community",useCommunity);
app.use("/api/v1/messages",useMessages);

export {app}