import dotenv from 'dotenv';
import express from 'express';
import { app } from './app.js';
import connectDb from './db/index.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const port = process.env.PORT || 3001;

// Create HTTP server with Express app
const server = http.createServer(app);

// ✅ Initialize Socket.IO with Correct CORS
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://link-nest-frontend-chi.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Store active users
const users = {};

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Handle user joining a chat room
  socket.on('joinRoom', ({ userId, groupId }) => {
    socket.join(groupId);
    users[socket.id] = { userId, groupId };
    console.log(`User ${userId} joined room ${groupId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', (messageData) => {
    const { groupId, message } = messageData;
    io.to(groupId).emit('receiveMessage', messageData);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.id];
  });
});

// ✅ Connect to MongoDB and Start Server
connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Error:', err);
  });

export { io };
export default server;
