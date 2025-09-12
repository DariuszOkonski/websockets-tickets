const mongoose = require('mongoose');
const Concerts = require('../models/concert.model');

const getAll = async (req, res) => {
  try {
    const concerts = await Concerts.find();
    return res.json({ data: concerts });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getConcert = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid concert ID' });
    }

    const concert = await Concerts.findById(req.params.id);

    if (!concert) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.json({ data: concert });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const createConcert = async (req, res) => {
  try {
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

    const newConcert = new Concerts({ performer, genre, price, day, image });
    await newConcert.save();

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const updateConcert = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'missing data to update' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid concert ID' });
    }

    const concert = await Concerts.findById(req.params.id);

    if (!concert) {
      return res.status(404).json({ message: 'Not found' });
    }

    const performer = req.body.performer ?? concert.performer;
    const genre = req.body.genre ?? concert.genre;
    const price = req.body.price ?? concert.price;
    const day = req.body.day ?? concert.day;
    const image = req.body.image ?? concert.image;

    await Concerts.updateOne(
      { _id: req.params.id },
      { $set: { performer, genre, price, day, image } }
    );

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const deleteConcert = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const concert = await Concerts.findById(req.params.id);

    if (!concert) {
      return res.status(404).json({ message: 'Not found' });
    }

    await Concerts.deleteOne({ _id: req.params.id });
    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = {
  getAll,
  getConcert,
  createConcert,
  updateConcert,
  deleteConcert,
};
