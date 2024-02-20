const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({
    event: {
        type: String,
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