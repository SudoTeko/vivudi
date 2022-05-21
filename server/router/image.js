const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/upload');
const {upload, images} = require('../controller/image');

router
.get('/:image', images)
.post('/upload',uploadMiddleware, upload);

module.exports = router;