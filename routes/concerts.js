const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
let db = require('../db');

router.get('/', (req, res) => {
  res.json({ data: db.concerts });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const concerts = db.concerts.find((item) => item.id == id);

  if (concerts) {
    return res.json({ data: concerts });
  } else {
    return res.status(404).json({ message: 'not found' });
  }
});

router.post('/', (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: 'missing all data' });
  }

  if (
    !req.body.performer ||
    !req.body.genre ||
    !req.body.price ||
    !req.body.day ||
    !req.body.image
  ) {
    return res.status(400).json({ message: 'missing some data' });
  }

  const { performer, genre, price, day, image } = req.body;

  db.concerts.push({ id: uuidv4(), performer, genre, price, day, image });

  res.json({ message: 'OK' });
});

router.put('/:id', (req, res) => {
  if (Object.keys(req.query).length === 0) {
    return res.status(400).json({ message: 'missing data to update' });
  }

  const { id } = req.params;

  const concerts = db.concerts.find((item) => item.id === id);

  if (!concerts) {
    return res
      .status(404)
      .json({ message: 'this element does not exists in database' });
  }

  if (req.query.performer) {
    concerts.performer = req.query.performer;
  }

  if (req.query.genre) {
    concerts.genre = req.query.genre;
  }
  if (req.query.price) {
    concerts.price = req.query.price;
  }
  if (req.query.day) {
    concerts.day = req.query.day;
  }
  if (req.query.image) {
    concerts.image = req.query.image;
  }

  db.concerts = db.concerts.map((item) => {
    if (item.id === id) {
      return concerts;
    }
    return item;
  });

  res.json({ message: 'OK' });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const concerts = db.concerts.find((item) => item.id === id);

  if (!concerts) {
    return res
      .status(404)
      .json({ message: 'this element does not exists in database' });
  }

  db.concerts = db.concerts.filter((item) => item.id !== id);

  res.json({ message: 'OK' });
});

module.exports = router;
