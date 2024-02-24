const mongoose = require("mongoose")


const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Array,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    seatingChart: {
        type: String,
    },
    openTo: {
        type: Map,
    },
    tickets: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
        ref: "Ticket", // Reference to 'Ticket' model
    }
})

const Item = mongoose.model('Event', eventSchema)
module.exports = Item