const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const testimonialsRoutes = require('./routes/testimonials');
const concertsRoutes = require('./routes/concerts');
const seatsRoutes = require('./routes/seats');

const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  next();
});

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

// Connect to database
mongoose.connect('mongodb://0.0.0.0:27017/NewWaveDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to the MongoDB...');
});
db.on('error', (err) => console.log('Error ' + err));

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('CONNECTION: ', socket.id);
});
