const express = require('express');

const router = express.Router();

const {
    getMe,
    getHotels
} = require('../controller/user');

router
.get('/me', getMe)
.get('/hotels', getHotels);

module.exports = router;