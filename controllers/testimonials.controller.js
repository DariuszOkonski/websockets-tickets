const Testimonials = require('../models/testimonial.model');
const mongoose = require('mongoose');

const getAll = async (req, res) => {
  try {
    const testimonials = await Testimonials.find();
    return res.json({ data: testimonials });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getRandom = async (req, res) => {
  try {
    const count = await Testimonials.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const testimonial = await Testimonials.findOne().skip(rand);

    if (!testimonial) {
      return res.status(404).json({ msg: 'Not found' });
    }

    return res.json({ data: testimonial });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getTestimonial = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid testimonial ID' });
    }

    const testimonial = await Testimonials.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.json({ data: testimonial });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const createTestimonial = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'missing all data' });
    }

    if (!req.body.author || !req.body.text) {
      return res.status(400).json({ message: 'missing data' });
    }

    const { author, text } = req.body;

    const newTestimonial = new Testimonials({ text, author });
    await newTestimonial.save();

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'missing data to update' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid testimonial ID' });
    }

    const testimonial = await Testimonials.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Not found' });
    }

    const author = req.body.author ?? testimonial.author;
    const text = req.body.text ?? testimonial.text;

    await Testimonials.updateOne(
      { _id: req.params.id },
      { $set: { author, text } }
    );

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const testimonial = await Testimonials.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Not found' });
    }

    await Testimonials.deleteOne({ _id: req.params.id });
    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = {
  getAll,
  getRandom,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
