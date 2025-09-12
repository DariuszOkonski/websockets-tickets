const express = require('express');
const router = express.Router();

const SeatController = require('../controllers/seats.controller');

router.get('/', SeatController.getAll);

router.get('/:id', SeatController.getSeat);

router.post('/', SeatController.createSeat);

router.put('/:id', SeatController.updateSeat);

router.delete('/:id', SeatController.deleteSeat);

module.exports = router;
