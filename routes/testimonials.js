const express = require('express');
const router = express.Router();
const TestimonialController = require('../controllers/testimonials.controller');

router.get('/', TestimonialController.getAll);

router.get('/random', TestimonialController.getRandom);

router.get('/:id', TestimonialController.getTestimonial);

router.post('/', TestimonialController.createTestimonial);

router.put('/:id', TestimonialController.updateTestimonial);

router.delete('/:id', TestimonialController.deleteTestimonial);

module.exports = router;
