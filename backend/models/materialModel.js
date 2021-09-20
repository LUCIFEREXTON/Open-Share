const mongoose = require('mongoose');

const { Schema } = mongoose;

const MaterialSchema = new Schema({
    authorId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    subjectName: {
        type: String
    },
    year: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);