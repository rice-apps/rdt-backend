const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({

    event: {
        type: mongoose.Schema.Types.ObjectId, // ObjectId
        ref: "Event", // Reference to 'User' model
        // required: true,
    },
    buyerName: {
        type: String, // ObjectId
        // ref: "User", // Reference to 'User' model
        default: null,
    },
    attendeeName: {
        type: String,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // ObjectId
        ref: "User", // Reference to 'User' model
        default: null,
    },
    seat: {
        type: String,
        // required: true,
    },
    isPaid: {
        type: Boolean,
        // required: true,
        default: false,
    },
    
})

const Item = mongoose.model('Ticket', ticketSchema)
module.exports = Item