const mercaderia = [
    { id: 1, nombre: 'Pizza', precio: 5000},
    { id: 2, nombre: 'empanadas', precio: 80000},
    { id: 3, nombre: 'Tartas', precio: 4000},
];

let carrito = [];
function mostrarProductos(productos = mercaderia) {
    const productosDiv = document.getElementById('productos');
    productosDiv.innerHTML = '';
    productos.forEach(comida => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.innerHTML = `
            <h2>${comida.nombre}</h2>
            <p>Precio: $${comida.precio}</p>
            <button onclick="agregarCarrito(${comida.id})">Agregar al Carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
    });
}
// agregar
function agregarCarrito(id) {
    const comida = mercaderia.find(r => r.id === id);
    carrito.push(comida);
    alert(`${comida.nombre} se agrego a tu carrito.`);
}

// eliminar 
function eliminarDelCarrito(id) {
    const index = carrito.findIndex(r => r.id === id);
    if (index !== -1) {
        const [comida] = carrito.splice(index, 1);
        alert(`${comida.nombre} su producto a sido eliminado.`);
    }
}


// filtrar por los nombres
function filtrarProductos() {
    const busqueda = document.getElementById('buscar').value.toLowerCase();
    const productosFiltrados = mercaderia.filter(comida =>
        comida.nombre.toLowerCase().includes(busqueda)
    );
    mostrarProductos(productosFiltrados);
}

// Voila!
mostrarProductos();
