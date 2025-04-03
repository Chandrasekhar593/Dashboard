const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Sample notifications to emit
const sampleNotifications = [
  'Bitcoin price has increased by 5%',
  'Weather alert: Rain expected in London',
  'Ethereum price has dropped by 3%',
  'System update: New features available',
  'Market update: Trading volume increased by 20%'
];

// WebSocket setup
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send welcome notification
  socket.emit('notification', {
    id: Date.now(),
    message: 'Welcome to the Dashboard!',
    timestamp: new Date().toISOString()
  });
  
  // When client emits a notification, broadcast it to all clients
  socket.on('notification', (data) => {
    console.log('Notification received:', data);
    io.emit('notification', data);
  });
  
  // Emit a random notification every 30 seconds
  const notificationInterval = setInterval(() => {
    const randomNotification = {
      id: Date.now(),
      message: sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)],
      timestamp: new Date().toISOString()
    };
    
    io.emit('notification', randomNotification);
  }, 30000);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(notificationInterval);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});