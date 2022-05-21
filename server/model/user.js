///
///  User model
///

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validate = require("mongoose-validate");
const jwt = require("jsonwebtoken");

const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            unique: true,
            validate: [validate.email, "Please add a valid email"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
            minlength: 6,
            select: false,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        // last name of user
        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        avatar: {
            type: String,
            trim: true,
            default: "default path image avartar",
        },

        hotels: [
            {
                type: ObjectId,
                ref: "Hotel",
            }
        ]
    },
    {
        toObject: {
            virtuals: true,
        },
        toJSON: {
            virtuals: true,
        },
    }
);

UserSchema.virtual("fullname").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// populate
UserSchema.virtual("getHotels", {
    ref: "Hotel",
    localField: "hotels",
    foreignField: "_id",
    justOne: false,
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// find by id or username or email.
UserSchema.statics.findByIdentifier = async function (identifier) {
    let opts = {};

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        opts.$or = [{ _id: identifier }];
    } else {
        opts.email = identifier;
    }

    return this.findOne(opts).select("+password");
};

UserSchema.methods.getSignedJWTToken = async function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.toJSON = function (addition) {
    const result = {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        avatar: this.avatar,
        createdAt: this.createdAt,
    };

    return result

};

module.exports = mongoose.model('User', UserSchema);