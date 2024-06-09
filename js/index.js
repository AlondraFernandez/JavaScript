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

/*cuenta
function mostrarCarrito() {
    if (carrito.length === 0) {
        alert('por favor seleccione un producto');
        return;
    }
    let total = 0;
    let mensaje = 'el carrito del hambre:\n';
    carrito.forEach((comida, index) => {
        const precioTotal = comida.precio * (1 - comida.descuento / 100);
        mensaje += `${index + 1}. ${comida.nombre} - Precio: $${precioTotal.toFixed(2)}\n`;
    });
    mensaje += `\n su cuenta es: $${total.toFixed(2)}\n`;
    mensaje += '\n¿Queres eliminar algún producto del carrito?';
    const respuesta = prompt(mensaje);
    if (respuesta !== null) {
        const numero = parseInt(respuesta);
        if (!isNaN(numero) && numero > 0 && numero <= carrito.length) {
            eliminarDelCarrito(carrito[numero - 1].id);
        } else {
            alert('No tenes nada en esa opcion.');
        }
    }
}*/

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
