const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// 1. MIDDLEWARE
app.use(express.json()); 
app.use(express.static('public')); // This serves your HTML and JS files

// 2. DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/mystore')
  .then(() => console.log('✅ Connected to MongoDB...'))
  .catch(err => console.error('❌ Could not connect to MongoDB...', err));

// 3. DATABASE SCHEMAS
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    inStock: Boolean
});
const Product = mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 4. AUTH MIDDLEWARE (The Security Guard)
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send("Access Denied. No token provided.");

    try {
        const verified = jwt.verify(token, 'secret_key_123');
        req.user = verified;
        next(); 
    } catch (err) {
        res.status(400).send("Invalid Token");
    }
};

// 5. ROUTES

// Register User
app.post('/api/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({ username: req.body.username, password: hashedPassword });
        await newUser.save();
        res.status(201).send("User registered successfully!");
    } catch (err) {
        res.status(400).send("Registration failed.");
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).send("User not found.");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send("Invalid password.");

        const token = jwt.sign({ _id: user._id }, 'secret_key_123');
        res.header('auth-token', token).send({ message: "Logged in!", token: token });
    } catch (err) {
        res.status(500).send("Login error.");
    }
});

// Get All Products (With Category Filter)
app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        let filter = category ? { category } : {};
        const products = await Product.find(filter);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// Add Product
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ error: "Failed to create product" });
    }
});

// Delete Product 
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (deletedProduct) {
            res.json({ message: "Product deleted", deletedProduct });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        res.status(400).send('Invalid ID format');
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce API!');
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));