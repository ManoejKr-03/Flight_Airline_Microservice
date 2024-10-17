// flights/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/flights')
    .then(() => console.log('MongoDB connected for flights'))
    .catch(err => console.error('MongoDB connection error:', err));

// Flight Model
const flightSchema = new mongoose.Schema({
    flightNumber: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    airlineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Airline' }
});

const Flight = mongoose.model('Flight', flightSchema);

// Routes
app.get('/flights', async (req, res) => {
    try {
        const flights = await Flight.find();
        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching flights.' });
    }
});

app.post('/flights', async (req, res) => {
    const { flightNumber, origin, destination, airlineCode } = req.body;

    try {
        // Fetch the airlineId from the airline microservice using the airline code
        const response = await axios.get(`http://localhost:3003/airlines?code=${airlineCode}`); // Adjust the port based on your airlines service
        const airline = response.data[0]; // Assuming the response returns an array of airlines

        if (!airline) {
            return res.status(404).json({ error: 'Airline not found' });
        }

        const flight = new Flight({
            flightNumber,
            origin,
            destination,
            airlineId: airline._id // Use the airlineId from the response
        });

        await flight.save();
        res.status(201).json(flight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//for passenger microservice get the flight details by using flight id
app.get('/flights/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const flight = await Flight.findById(id).populate('airlineId'); // Populate airline details
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }
        res.json(flight);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the flight.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Flights service running on port ${port}`);
});
