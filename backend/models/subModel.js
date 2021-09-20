const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubSchema = new Schema({
    name: {
        type: String
    },
    year: {
        type: String
    }
});

module.exports = mongoose.model('Sub', SubSchema);