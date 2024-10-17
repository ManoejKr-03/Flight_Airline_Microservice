// flights/models/Flight.js

const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    airlineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Airline' }, // Reference to airlines
});

module.exports = mongoose.model('Flight', flightSchema);
