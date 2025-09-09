const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
// const socket = require('socket.io');
let db = require('../db');

router.get('/', (req, res) => {
  res.json({ data: db.seats });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const seats = db.seats.find((item) => item.id == id);

  if (seats) {
    return res.json({ data: seats });
  } else {
    return res.status(404).json({ message: 'not found' });
  }
});

router.post('/', (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: 'missing all data' });
  }

  if (!req.body.day || !req.body.seat || !req.body.client || !req.body.email) {
    return res.status(400).json({ message: 'missing some data' });
  }

  const isSeatAlreadyTaken = db.seats.some(
    ({ seat, day }) => seat === req.body.seat && day === req.body.day
  );

  if (isSeatAlreadyTaken) {
    return res.status(409).json({ message: 'The slot is already taken...' });
  }

  const { day, seat, client, email } = req.body;

  db.seats.push({ id: uuidv4(), day, seat, client, email });

  // TODO: socket on here

  res.json({ message: 'OK' });
});

router.put('/:id', (req, res) => {
  if (Object.keys(req.query).length === 0) {
    return res.status(400).json({ message: 'missing data to update' });
  }

  const { id } = req.params;

  const seat = db.seats.find((item) => item.id === id);

  if (!seat) {
    return res
      .status(404)
      .json({ message: 'this element does not exists in database' });
  }

  if (req.query.day) {
    seat.day = Number(req.query.day);
  }

  if (req.query.seat) {
    seat.seat = Number(req.query.seat);
  }
  if (req.query.client) {
    seat.client = req.query.client;
  }
  if (req.query.email) {
    seat.email = req.query.email;
  }

  db.seats = db.seats.map((item) => {
    if (item.id === id) {
      return seat;
    }
    return item;
  });

  res.json({ message: 'OK' });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const seats = db.seats.find((item) => item.id === id);

  if (!seats) {
    return res
      .status(404)
      .json({ message: 'this element does not exists in database' });
  }

  db.seats = db.seats.filter((item) => item.id !== id);

  res.json({ message: 'OK' });
});

module.exports = router;
