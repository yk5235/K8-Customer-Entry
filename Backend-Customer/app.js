const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://192.168.99.101:27017/customerDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
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