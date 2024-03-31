const mongoose = require("mongoose")


const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        unique: true,
    },
    startDate: {
        type: Date,
        // required: true,
    },
    endDate: {
        type: Date,
        // required: true,
    },
    startTime: {
        type: String,
    },
    description: {
        type: String,
    },
    basePrice: {
        type: Number,
        // required: true,
    },
    studentDiscount: {
        type: Number
    },
    atDoorPrice: {
        type: Number
    },
    redemptionCode: {
        type: String,
    },
    location: {
        type: String,
        // required: true,
    },
    photo: {
        type: String,
    },
    availableSeats: {
        type: [String],
        // required: true,
    },
    tickets: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
        ref: "Ticket", // Reference to 'User' model
    }
})

const Item = mongoose.model('Event', eventSchema)
module.exports = Item