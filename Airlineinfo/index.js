// airlines/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/airlines')
    .then(() => console.log('MongoDB connected for airlines'))
    .catch(err => console.error('MongoDB connection error:', err));

// Airline Model
const airlineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
});

const Airline = mongoose.model('Airline', airlineSchema);

// Routes
app.get('/all/airlines', async (req, res) => {
    try {
        const airlines = await Airline.find();
        res.json(airlines);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching airlines.' });
    }
});

//fetching the airline based on airline code
app.get('/airlines', async (req, res) => {

  //  const { codeAnother } = req.params.code;
const {id} =req.query; //002
//    console.log(id);
// //    res.json("hello");
//     console.log(typeof id);
   
   
   //  Get the code from query parameters

    try {
        if (id) {
            const airline = await Airline.findOne({ code: id });  //002
            if (!airline) {
                return res.status(404).json({ error: 'Airline not found' });
            }
            return res.json(airline); // Return the specific airline if code is provided
        }
        
        // If no code is provided, return all airlines
        // const airlines = await Airline.find();
        // res.json(airlines);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching airlines.' });
    }
});

app.post('/airlines', async (req, res) => {
    const { name, code } = req.body;
    
    const airline = new Airline({ name, code });

    try {
        await airline.save();
        res.status(201).json(airline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Airlines service running on port ${port}`);
});
