const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory storage for customer entries
let customers = [];

// Home route - Render the form and list of entries
app.get('/', (req, res) => {
    res.render('index', { customers });
});

// Add a new customer entry
app.post('/add', (req, res) => {
    const { name, item, quantity } = req.body;
    customers.push({ id: Date.now(), name, item, quantity });
    res.redirect('/');
});

// Edit a customer entry - Render the form with the selected entry
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const customer = customers.find((c) => c.id == id);
    if (customer) {
        res.render('index', { customers, editing: customer });
    } else {
        res.redirect('/');
    }
});

// Edit a customer entry
app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name, item, quantity } = req.body;
    const customer = customers.find((c) => c.id == id);
    if (customer) {
        customer.name = name;
        customer.item = item;
        customer.quantity = quantity;
    }
    res.redirect('/');
});

// Delete a customer entry
app.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    customers = customers.filter((c) => c.id != id);
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});