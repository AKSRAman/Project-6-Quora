const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const questionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    tag: [{
        type: String
    }],
    askedBy: {
        type: objectId,
        ref: 'project6user'
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
module.exports = mongoose.model("question", questionSchema)