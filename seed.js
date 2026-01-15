const mongoose = require('mongoose');

// Replace with your MongoDB URI if different
const dbURI = 'mongodb://localhost:27017/mystore';

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    inStock: Boolean
});

const Product = mongoose.model('Product', productSchema);

const seedProducts = [
    {
        name: "Mechanical Keyboard",
        price: 89.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500",
        inStock: true
    },
    {
        name: "Gaming Mouse",
        price: 45.50,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
        inStock: true
    },
    {
        name: "Noise Cancelling Headphones",
        price: 199.99,
        category: "Gadgets",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        inStock: true
    },
    {
        name: "Smart Watch",
        price: 249.00,
        category: "Gadgets",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        inStock: true
    },
    {
        name: "Ergonomic Gaming Chair",
        price: 350.00,
        category: "Furniture",
        image: "https://images.unsplash.com/photo-1598550476439-6847785fce66?w=500",
        inStock: true
    }
];

mongoose.connect(dbURI)
    .then(async () => {
        console.log("Connected to MongoDB for seeding...");
        await Product.deleteMany({}); // Clears old broken items
        await Product.insertMany(seedProducts);
        console.log("✅ Database Seeded Successfully!");
        process.exit();
    })
    .catch(err => console.log(err));