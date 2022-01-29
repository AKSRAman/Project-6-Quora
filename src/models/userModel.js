const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    creditScore: {
        type: Number,
        default: 500
    }
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema);