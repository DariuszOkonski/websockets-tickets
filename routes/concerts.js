const express = require('express');
const router = express.Router();

const ConcertController = require('../controllers/concerts.controller');

router.get('/', ConcertController.getAll);

router.get('/:id', ConcertController.getConcert);

router.post('/', ConcertController.createConcert);

router.put('/:id', ConcertController.updateConcert);

router.delete('/:id', ConcertController.deleteConcert);

module.exports = router;
