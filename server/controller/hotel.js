const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../util/async');
const Hotel = require('../model/hotel');

const selectHotel = {
    image: 1,
    roomType: 1,
    address: 1,
    description: 1,
    numberBedrooms: 1,
    numberBathrooms: 1,
    amenities: 1,
    price: 1
}

module.exports.getHotels = asyncHandler(async function(req, res, next){
    const hotels = await Hotel.find().lean().select(selectHotel);
    res
    .status(200)
    .json({
        success: true,
        hotels
    });
});

module.exports.getDetailHotel = asyncHandler(async function(req, res, next){

    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId).lean().select(selectHotel);

    res
    .status(200)
    .json({
        success: true,
        hotel
    });

});

module.exports.createHotel = asyncHandler(async function(req, res, next){

    const hotelInfo = {
        image,
        roomType,
        address,
        description,
        numberBedrooms,
        numberBathrooms,
        amenities,
        price
    } = req.body;

    // console.log(hotelInfo);

    const hotel = await Hotel.create(hotelInfo);

    if(!hotel){
        return next('Error create hotel', 401);
    }

    res
    .status(201)
    .json({
        success: true,
        hotelId: hotel.id
    });

});

module.exports.updateHotel = asyncHandler(async function(req, res, next){

    const hotelId = req.params.hotelId;

    const hotel = {
        image,
        roomType,
        address,
        description,
        numberBedrooms,
        numberBathrooms,
        amenities,
        price
    } = req.body;

    const hotelUpdate = await Hotel.findByIdAndUpdate(hotelId, hotel);

    if(!hotelUpdate){
        return next(ErrorResponse(`Error update hotel ${hotelId}`, 401))
    }

    res
    .status(200)
    .json({
        success: true,
    });

});

module.exports.deleteHotel = asyncHandler(async function(req, res, next){
    const hotelId = req.params.hotelId;

    const hotelDelete = await Hotel.findByIdAndRemove(hotelId);

    if(!hotelDelete){
        return next(`Error delete hotel ${hotelId}`, 401);
    }

    res
    .status(200)
    .json({
        success: true
    });

});

