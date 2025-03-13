const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection
    //'mongodb://mongo:password@mongodb:27017/customerDB?authSource=admin'
//const mongoUri = 'mongodb://mongo:password@mongodb:27017/customerDB?authSource=admin';    
const mongoUri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

console.log(`mongoUri: ${mongoUri}`);
console.log(`MONGO_USERNAME: ${process.env.MONGO_USERNAME}`);
console.log(`MONGO_PASSWORD: ${process.env.MONGO_PASSWORD}`);

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Customer schema and model
const customerSchema = new mongoose.Schema({
    name: String,
    address: String,
    country: String,
    gender: String,
    age: Number
});

const Customer = mongoose.model('Customer', customerSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Customer Data Entry API');
});

// Create a new customer entry
app.post('/customers', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).send(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(400).send(error);
    }
});


// Get all customer entries

app.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).send(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).send(error);
    }
});

// Get all customer entries
/**
app.get('/customers', async (req, res) => {
    try {
        console.log('Fetching customers...');
        // Static data to be sent as response
        const customers = [
            {
                _id: '1',
                name: 'John Doe',
                address: '123 Main St',
                country: 'USA',
                gender: 'Male',
                age: 30
            },
            {
                _id: '2',
                name: 'Jane Smith',
                address: '456 Elm St',
                country: 'Canada',
                gender: 'Female',
                age: 25
            }
        ];
        res.status(200).send(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).send(error);
    }
});
**/

// Get a customer entry by ID
app.get('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).send();
        }
        res.status(200).send(customer);
    } catch (error) {
        console.error('Error fetching customer by ID:', error);
        res.status(500).send(error);
    }
});

// Update a customer entry by ID
app.patch('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!customer) {
            return res.status(404).send();
        }
        res.status(200).send(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(400).send(error);
    }
});

// Delete a customer entry by ID
app.delete('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).send();
        }
        res.status(200).send(customer);
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).send(error);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});