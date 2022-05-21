const jwt = require("jsonwebtoken");
const asyncHandler = require('../util/async');
const ErrorResponse = require('../util/errorResponse');

module.exports.protect = asyncHandler(async function (req, res, next) {
    let token;
    const reqHeaderAuth = req.headers.authorization;

    if (reqHeaderAuth && reqHeaderAuth.startsWith("Bearer")) {
        token = reqHeaderAuth.split(" ")[1];
    }

    if (!token) {
        return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = await User.findById(decoded.id);
    const userId = decoded.userId;

    req.body.userId = userId;
    req.params.userId = userId;
    req.query.userId = userId;
    next();

});