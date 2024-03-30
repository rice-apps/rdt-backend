const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    thirdPartyId: {
        type: String,
    },
    tickets: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
        ref: "Ticket", // Reference to 'User' model
        // required: true,
    },
    email: {
        type: String,
        // required: true,
        unique: true,
    },
    password: {
        type: String,
        // required: true,
    },
    fullName: {
        type: String,
        // required: true,
    },
    isRiceStudent: {
        type: Boolean,
        // required: true,
        default: false,
    },
    venmoHandle: {
        type: String,
        unique: true,
    }
})

const Item = mongoose.model('User', userSchema)
module.exports = Item