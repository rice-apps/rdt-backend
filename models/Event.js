const mongoose = require("mongoose")


const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    redemptionCodes: {
        type: Map,
    },
    location: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    seatingChart: {
        type: [String],
        required: true,
    },
    tickets: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
        ref: "Ticket", // Reference to 'User' model
    }
})

const Item = mongoose.model('Event', eventSchema)
module.exports = Item