const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../util/async');
const User = require('../model/user');


const selectUser = {
    firstName: 1,
    lastName: 1,
    avatar: 1,
    createdAt: 1,
}

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

module.exports.register = asyncHandler(async function (req, res, next) {
    const userInfo = { email, password, firstName, lastName, avatar } = req.body;

    const user = await User.create(userInfo);

    if(!user){
        return next("Error register", 401);
    }

    res
    .status(201)
    .json({
        success: true
    });

});

module.exports.login = asyncHandler(async function (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }

    const user = await User.findByIdentifier(email);

    if (!user) {
        return next(new ErrorResponse("Invalid user", 400));
    }

    const isCorrectedPassword = await user.comparePassword(password);

    if (!isCorrectedPassword) {
        return next(new ErrorResponse("Wrong password", 400));
    }

    // Create token
    const token = await user.getSignedJWTToken();
    res.status(200).json({
        success: true,
        token,
    });

});


module.exports.getMe = asyncHandler(async function (req, res, next) {
    const userId = req.body.userId;

    const user = await User.findById(userId).lean().select(selectUser);

    res
        .status(200)
        .json({
            success: true,
            user,
        });

});

module.exports.getHotels = asyncHandler(async function (req, res, next) {
    const userId = req.body.userId;

    const user = await User.findById(userId)
        .lean()
        .select({ hotels: 1 })
        .populate(
            {
                path: 'hotels',
                select: selectHotel,
                options: {
                    lean: true,
                    sort: {
                        updateAt: 'desc'
                    }
                }
            }
        );

    res
        .status(200)
        .json({
            success: true,
            count: user.hotels.length,
            hotels: user.hotels
        });

});