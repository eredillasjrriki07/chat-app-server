require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');

const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

const { createServer } = require('http'); // Import HTTP module
const { Server } = require('socket.io'); // Import Socket.IO
const socketHandler = require('./config/socketConn');
const allowedOrigins = require('./config/allowedOrigins');

const PORT = process.env.PORT || 3500;

// Connect to database
connectDB();

// Create HTTP server and attach Socket.IO
const httpServer = createServer(app); // Create an HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins, // Adjust origin based on your frontend URL
  },
});

// Initialize Socket.IO handlers
socketHandler(io);

// Middleware and routes setup
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));

app.use(verifyJWT);
app.use('/api/conversations', require('./routes/api/conversations'));
app.use('/api/messages', require('./routes/api/messages'));
app.use('/api/users/search', require('./routes/api/search'));

// Start the server after connecting to MongoDB
mongoose.connection.once('open', () => {
  console.log('Connected to database');
  httpServer.listen(PORT, () => console.log(`App now listening on port ${PORT}`));
});
