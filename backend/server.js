const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();
const app = express();
app.use(express.json()); // Accept JSON data

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

// --- Deployment Config --- //
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, 'frontend', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.send('Server is running.'));
}

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Socket.io setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  soc
