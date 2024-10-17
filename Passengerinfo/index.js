// passengers/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Passenger = require('./PassengerDetails');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/passengers', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/passengers', async (req, res) => {
    const passengers = await Passenger.find();
    res.json(passengers);
});

// app.post('/passengers', async (req, res) => {
//     const passenger = new Passenger(req.body);
//     await passenger.save();
//     res.status(201).json(passenger);
// });
app.post('/passengers', async (req, res) => {
    const { name, email, flightId } = req.body;

    try {
        // Fetch the flight details from the flight service
        const flightResponse = await axios.get(`http://localhost:3002/flights/${flightId}`); // Adjust the port based on your flights service
        const flight = flightResponse.data;

        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }

        const passenger = new Passenger({ name, email, flightId });

        await passenger.save();
        res.status(201).json(passenger);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'Flight not found' });
        }
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Passengers service running on port ${port}`);
});

