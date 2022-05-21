const asyncHandler = require("../util/async");
const path = require('path');
const Resize = require('../util/resize');

module.exports.upload = asyncHandler(async function(req, res, next){

    if(!req.file){
        return next(new ErrorResponse("Please provide an image", 401));
    }

    const imagePath = './public/images';

    const fileUpload = new Resize(imagePath, req.file.originalname);

    console.log(req.file.originalname);

    const filename = await fileUpload.save(req.file.buffer);

    const urlImage = process.env.SERVER_URL+`/image/${filename}`;

    res
    .status(200)
    .json({
        success: true,
        url: urlImage
    });

});

module.exports.images = asyncHandler(async function(req, res, next){

    const imageName = req.params.image;
    console.log(imageName);
    res
    .status(200)
    .sendFile(path.join(__dirname,'..',`/public/images/${imageName}`));
});

