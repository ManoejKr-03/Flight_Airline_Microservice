// passengers/models/Passenger.js

const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' }, // Reference to flights
});

module.exports = mongoose.model('Passenger', passengerSchema);
