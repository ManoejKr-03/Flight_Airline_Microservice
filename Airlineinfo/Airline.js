const mongoose = require('mongoose');

const airlineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

module.exports = mongoose.model('Airline', airlineSchema);
