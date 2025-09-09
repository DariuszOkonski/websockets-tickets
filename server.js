const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const socketIO = require('socket.io');
const testimonialsRoutes = require('./routes/testimonials');
const concertsRoutes = require('./routes/concerts');
const seatsRoutes = require('./routes/seats');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

// Routes
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/concerts', concertsRoutes);
app.use('/api/seats', seatsRoutes);

app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const io = socket(server);

// io.on('connection', (socket) => {
//   console.log('connection is on: ', socket.id);
// });
