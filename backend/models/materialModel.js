const mongoose = require('mongoose');

const { Schema } = mongoose;

const MaterialSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    subjectName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    year: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Material', MaterialSchema);