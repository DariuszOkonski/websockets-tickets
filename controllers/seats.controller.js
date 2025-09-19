const Seats = require('../models/seat.model');
const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');

const getAll = async (req, res) => {
  try {
    const seats = await Seats.find();
    return res.json({ data: seats });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getSeat = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid testimonial ID' });
    }

    const seat = await Seats.findById(req.params.id);

    if (!seat) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.json({ data: seat });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const createSeat = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'missing all data' });
    }

    if (
      !req.body.day ||
      !req.body.seat ||
      !req.body.client ||
      !req.body.email
    ) {
      return res.status(400).json({ message: 'missing some data' });
    }

    // sanitize here
    const day = sanitize(req.body.day);
    const seat = sanitize(req.body.seat);
    const client = sanitize(req.body.client);
    const email = sanitize(req.body.email);

    const seats = await Seats.find();

    const isSeatAlreadyTaken = seats.some(
      ({ seat, day }) => seat === Number(seat) && day === Number(day)
    );

    if (isSeatAlreadyTaken) {
      return res.status(409).json({ message: 'The slot is already taken...' });
    }

    // const { day, seat, client, email } = req.body;

    const newSeat = new Seats({ day, seat, client, email });
    newSeat.save();

    req.io.emit('seatsUpdated', seats);

    res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSeat = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'missing data to update' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid testimonial ID' });
    }

    const foundedSeat = await Seats.findById(req.params.id);

    if (!foundedSeat) {
      return res.status(404).json({ message: 'Not found' });
    }

    const day = req.body.day ?? foundedSeat.day;
    const seat = req.body.seat ?? foundedSeat.seat;
    const client = req.body.client ?? foundedSeat.client;
    const email = req.body.email ?? foundedSeat.email;

    await Seats.updateOne(
      { _id: req.params.id },
      { $set: { day, seat, client, email } }
    );

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const deleteSeat = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const seat = await Seats.findById(req.params.id);

    if (!seat) {
      return res.status(404).json({ message: 'Not found' });
    }

    await Seats.deleteOne({ _id: req.params.id });

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = {
  getAll,
  getSeat,
  createSeat,
  updateSeat,
  deleteSeat,
};
