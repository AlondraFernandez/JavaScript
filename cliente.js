// En el archivo client.js
function displayProducts() {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = '';
    
    productos.forEach(product => {
        const productElement = document.createElement('div');
        productElement.innerHTML = `
            <div>${product.nombre} - $${product.precio}</div>
            ${product.stock > 0 ? 
                `<button onclick="addToCart(${product.id})">Agregar al carrito</button>` : 
                `<button disabled>Sin stock</button>`
            }
        `;
        productContainer.appendChild(productElement);
    });
}
