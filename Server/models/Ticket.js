const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({

    event: {
        type: mongoose.Schema.Types.ObjectId, // ObjectId
        ref: "Event", // Reference to 'User' model
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // ObjectId
        ref: "User", // Reference to 'User' model
        required: true,
    },
    seat: {
        type: String,
        required: true,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    
})

const Item = mongoose.model('Ticket', ticketSchema)
module.exports = Item