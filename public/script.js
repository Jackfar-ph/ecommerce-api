async function displayProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();

        // 1. Calculate the Stats
        const totalItems = products.length;
        const totalValue = products.reduce((sum, p) => sum + p.price, 0);

        // 2. Update the HTML elements in the sidebar
        document.getElementById('totalItems').innerText = totalItems;
        document.getElementById('totalValue').innerText = totalValue.toFixed(2);

        const list = document.getElementById('product-list');
        list.innerHTML = ''; 

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <button class="delete-btn" onclick="deleteProduct('${product._id}')">×</button>
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <h3>${product.name}</h3>
                <span class="category-tag">${product.category}</span>
                <p class="price">$${product.price}</p>
                <button class="add-btn" onclick="alert('Added to cart!')">Add to Cart</button>
            `;
            list.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching products:", err);
    }
}

displayProducts();

async function addProduct() {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const imageUrl = document.getElementById('imageUrl').value;

    const newProduct = {
        name: name,
        price: parseFloat(price),
        category: category,
        image: imageUrl || 'https://via.placeholder.com/150', // Default image if empty
        inStock: true
    };

    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        if (response.ok) {
            alert('Product added successfully!');
            displayProducts(); // Refresh the list automatically
        }
    } catch (err) {
        console.error("Error adding product:", err);
    }
}

async function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'DELETE'
            });
            displayProducts(); // Refresh the list after deleting
        } catch (err) {
            console.error("Delete failed:", err);
        }
    }
}

function searchProducts() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const productName = card.querySelector('h3').innerText.toLowerCase();
        // If the name includes the search term, show it; otherwise, hide it
        if (productName.includes(term)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}