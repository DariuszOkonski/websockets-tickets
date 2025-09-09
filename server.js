const express = require('express');
const cors = require('cors');
const path = require('path');
const socketIO = require('socket.io');
const testimonialsRoutes = require('./routes/testimonials');
const concertsRoutes = require('./routes/concerts');
const seatsRoutes = require('./routes/seats');

const app = express();

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

// Start server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = socketIO(server);

console.log('connection before');
io.on('connection', (socket) => {
  console.log('connection is on: ', socket.id);
});
console.log('connection after');
