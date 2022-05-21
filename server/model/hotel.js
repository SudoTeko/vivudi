const mongoose = require('mongoose');
const { int } = require('mongoose-validate');
const validate = require('mongoose-validate');
const ObjectId = mongoose.Schema.Types.ObjectId;

const HotelSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: [true, "image is required"]
        },
        roomType: {
            type: String,
            required: [true, "room type is required"],
            trim: true,
        },
        address: {
            type: String,
            required: [true, "address is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        numberBedrooms: {
            type: Number,
            required: [true, "number bedrooms is required"],
        },
        numberBathrooms: {
            type: Number,
            required: [true, "number bedrooms is required"],
        },

        amenities: [{
            type: Boolean,
        }],

        price: {
            type: Number,
            required: [true, "price is reuired"],
        },
        upadateAt: {
            type: Date,
            default: Date.now(),
        }

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

HotelSchema.methods.toJSON = function (){
    return{
        _id: this._id,
        image: this.image,
        roomType: this.roomType,
        address: this.address,
        description: this.description,
        numberBedrooms: this.numberBedrooms,
        numberBathrooms: this.numberBathrooms,
        amenities: this.amenities,
        price: this.price
    }
}


module.exports = mongoose.model('Hotel', HotelSchema);