// server.js
require('dotenv').config();
const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const { router: authRoutes } = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Real-Time Chat using Socket.IO (Matching Fig 3)
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join Room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
  });

  // Handle Chat Message
  socket.on('chatMessage', ({ room, user, text }) => {
    // Console log format strictly matching Fig 3: [room] User: Message
    console.log(`[${room}] ${user}: ${text}`);
    
    // Broadcast message to room members
    io.to(room).emit('message', { user, text, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    // Optional disconnect logging
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});