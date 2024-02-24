const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    tickets: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
        ref: "Ticket", // Reference to 'Ticket' model
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userType: {
        type: String,
        required: true,
    },
    venmoHandle: {
        type: String,
        unique: true,
    }
})

const Item = mongoose.model('User', userSchema)
module.exports = Item