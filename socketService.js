import { io } from 'socket.io-client';

// Replace with your actual server URL when deployed
// For local development, this will connect to the development server
const SOCKET_URL = 'http://localhost:3001'; 

let socket;

export const connectToSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      
      // If connection fails, set up mock socket for testing/development
      setupMockSocket();
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  return socket;
};

// Mock socket for development without a backend server
const setupMockSocket = () => {
  console.log('Setting up mock socket');
  
  // Replace the socket with an event emitter that mimics Socket.io
  if (socket && typeof socket.disconnect === 'function') {
    socket.disconnect();
  }
  
  const eventHandlers = {};
  
  socket = {
    on: (event, handler) => {
      if (!eventHandlers[event]) {
        eventHandlers[event] = [];
      }
      eventHandlers[event].push(handler);
      return socket;
    },
    
    emit: (event, ...args) => {
      if (eventHandlers[event]) {
        eventHandlers[event].forEach(handler => handler(...args));
      }
      return socket;
    },
    
    disconnect: () => {
      Object.keys(eventHandlers).forEach(event => {
        eventHandlers[event] = [];
      });
      console.log('Mock socket disconnected');
    },
    
    connected: true
  };
  
  // Emit a connect event to trigger handlers
  if (eventHandlers.connect) {
    eventHandlers.connect.forEach(handler => handler());
  }
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};