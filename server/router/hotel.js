const express = require('express');
const router = express.Router();

const{
    getHotels,
    getDetailHotel,
    createHotel,
    updateHotel,
    deleteHotel
} = require('../controller/hotel');

router.post('/',createHotel);

router
.route('/:hotelId')
.get(getDetailHotel)
.put(updateHotel)
.delete(deleteHotel);

module.exports = router;