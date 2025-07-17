# LinkNest

LinkNest is a full-stack web application featuring a Next.js (React) frontend and an Express.js backend with MongoDB, supporting real-time chat, community features, and user authentication.

## Project Structure

```
linknest/
├── client/   # Next.js frontend
├── server/   # Express.js backend
```

## Features
- User authentication (register, login, logout)
- Community creation, update, and membership
- Real-time group chat (Socket.IO)
- Post sharing within communities
- Media uploads (profile images, post images)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### 1. Clone the repository
```bash
git clone <repo-url>
cd linknest
```

### 2. Setup the Backend (server)
```bash
cd server
npm install
# Create a .env file with your MongoDB URI and other secrets
npm run dev
```
Server runs on [http://localhost:3001](http://localhost:3001) by default.

### 3. Setup the Frontend (client)
```bash
cd client
npm install
npm run dev
```
Frontend runs on [http://localhost:3000](http://localhost:3000) by default.

## Scripts

### Server
- `npm run dev` — Start backend with nodemon

### Client
- `npm run dev` — Start Next.js frontend
- `npm run build` — Build frontend for production
- `npm run start` — Start production frontend
- `npm run lint` — Lint frontend code

## API Overview

### User Endpoints (`/api/v1/users`)
- `POST /register` — Register user (with profilePic upload)
- `POST /login` — Login user
- `POST /logout` — Logout user (JWT required)
- `POST /getGroup` — Get user chat groups
- `POST /post` — Post by user ID
- `POST /profile` — Get user profile

### Community Endpoints (`/api/v1/community`)
- `POST /register` — Create community (with profileImage upload)
- `POST /update` — Update community by name
- `GET /all` — Get all communities
- `POST /category` — Get communities by category
- `POST /addMember` — Add member to community
- `POST /byMember` — Get communities by user
- `POST /byId` — Get community by ID
- `POST /savePost` — Save post in community (with image upload)
- `GET /allposts` — Get all community posts
- `POST /deleteCommunity` — Delete community
- `POST /getmessage` — Get messages for a community

### Message Endpoints (`/api/v1/messages`)
- `POST /allMessages` — Get all messages by group ID
- `GET /check` — Health check
- `POST /saveMessage` — Save a message (with image upload)

## Real-time Communication
- Socket.IO is used for real-time chat between users in groups/communities.

## Deployment
- The project is configured for deployment on [Vercel](https://vercel.com/) (see `vercel.json` in the server and Next.js config in the client).

## License
MIT 