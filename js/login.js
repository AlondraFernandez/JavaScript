document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    const inventoryTable = document.getElementById("inventoryTable");
    const inventoryBody = document.getElementById("inventoryBody");

    // Función para cargar el inventario
    function loadInventory() {
        inventoryBody.innerHTML = ""; // Limpia la tabla antes de recargarla
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];

        inventory.forEach((product, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button onclick="editProduct(${index})">Editar</button>
                    <button onclick="deleteProduct(${index})">Eliminar</button>
                </td>
            `;

            inventoryBody.appendChild(row);
        });
    }

    // Función para agregar un nuevo producto
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newProduct = {
            name: document.getElementById("productName").value,
            category: document.getElementById("productCategory").value,
            price: parseFloat(document.getElementById("productPrice").value),
            stock: parseInt(document.getElementById("productStock").value, 10),
        };

        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.push(newProduct);
        localStorage.setItem("inventory", JSON.stringify(inventory));

        loadInventory();
        productForm.reset();
    });

    // Función para eliminar un producto
    window.deleteProduct = function(index) {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.splice(index, 1);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        loadInventory();
    };

    // Función para editar un producto
    window.editProduct = function(index) {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const product = inventory[index];

        document.getElementById("productName").value = product.name;
        document.getElementById("productCategory").value = product.category;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productStock").value = product.stock;

        deleteProduct(index); // Elimina el producto para luego re-agregarlo editado
    };

    // Cargar el inventario al iniciar la página
    loadInventory();
});