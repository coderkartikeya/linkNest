import dotenv from 'dotenv';
import express from 'express';
import connectDb from './db/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// ✅ CORS Middleware (Fixing CORS Issues)
const allowedOrigins = ['http://localhost:3000', 'https://link-nest-frontend-chi.vercel.app/'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// ✅ Middleware
app.use(express.json({ limit: '16kb' }));  // Parsing JSON
app.use(express.urlencoded({ extended: true, limit: "16kb" }));  // Parsing URL-encoded data
app.use(cookieParser());  // For cookies
app.use(express.static("public"));  // Serve static files

// ✅ Import Routes
import useRouter from './routes/user.routes.js';
import useCommunity from './routes/community.routes.js';
import useMessages from './routes/message.routes.js';

// ✅ Routes
app.use("/api/v1/users", useRouter);
app.use("/api/v1/community", useCommunity);
app.use("/api/v1/messages", useMessages);

// ✅ Connect to Database & Start Server
const port = process.env.PORT || 3001;
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Error:', err);
  });

export { app };
