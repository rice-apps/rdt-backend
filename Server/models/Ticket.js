const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Array of ObjectIds
        ref: "User", // Reference to 'User' model
        rtequired: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
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