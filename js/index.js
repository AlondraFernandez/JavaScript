const mercaderia = [
    { id: 1, nombre: 'Pizza', precio: 5000},
    { id: 2, nombre: 'Empanadas', precio: 8000},
    { id: 3, nombre: 'Tartas', precio: 4000},
];

let carrito = [];
let nextId = 4; // Para asignar IDs únicos a los nuevos productos

// Credenciales de administrador
const adminCredentials = {
    user: 'jope',
    password: 'jope123'
};

// Función para crear un elemento con clase y contenido opcional
function crearElemento(tag, clase, contenido) {
    const elemento = document.createElement(tag);
    if (clase) elemento.classList.add(clase);
    if (contenido) elemento.innerHTML = contenido;
    return elemento;
}

// Mostrar productos disponibles
function mostrarProductos(productos = mercaderia) {
    const productosDiv = document.getElementById('productos');
    productosDiv.innerHTML = '';
    productos.forEach(comida => {
        const productoDiv = crearElemento('div', 'producto');
        productoDiv.innerHTML = `
            <h2>${comida.nombre}</h2>
            <p>Precio: $${comida.precio}</p>
            <button onclick="agregarCarrito(${comida.id})">Agregar al Carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
    });
}

// Mostrar productos en la sección de administración
function mostrarProductosAdmin() {
    const listaAdmin = document.getElementById('listaAdmin');
    listaAdmin.innerHTML = '';
    mercaderia.forEach(comida => {
        const itemAdmin = crearElemento('div', 'admin-item');
        itemAdmin.innerHTML = `
            <input type="text" value="${comida.nombre}" onchange="modificarProducto(${comida.id}, 'nombre', this.value)">
            <input type="number" value="${comida.precio}" onchange="modificarProducto(${comida.id}, 'precio', this.value)">
            <button onclick="eliminarProducto(${comida.id})">Eliminar</button>
        `;
        listaAdmin.appendChild(itemAdmin);
    });
}

// Agregar nuevo producto
function agregarProducto() {
    const nombre = document.getElementById('nuevoNombre').value.trim();
    const precio = parseInt(document.getElementById('nuevoPrecio').value.trim());
    if (nombre && !isNaN(precio) && precio > 0) {
        const nuevoProducto = { id: nextId++, nombre, precio };
        mercaderia.push(nuevoProducto);
        mostrarProductos();
        mostrarProductosAdmin();
        document.getElementById('nuevoNombre').value = '';
        document.getElementById('nuevoPrecio').value = '';
    } else {
        alert('Por favor, ingresa un nombre válido y un precio mayor que cero.');
    }
}

// Modificar producto
function modificarProducto(id, campo, valor) {
    const producto = mercaderia.find(r => r.id === id);
    if (producto) {
        producto[campo] = campo === 'precio' ? parseInt(valor) : valor;
        mostrarProductos();
        mostrarProductosAdmin();
    }
}

// Eliminar producto
function eliminarProducto(id) {
    const index = mercaderia.findIndex(r => r.id === id);
    if (index !== -1) {
        mercaderia.splice(index, 1);
        mostrarProductos();
        mostrarProductosAdmin();
    }
}

// Agregar al carrito
function agregarCarrito(id) {
    const comida = mercaderia.find(r => r.id === id);
    carrito.push(comida);
    alert(`${comida.nombre} se agregó a tu carrito.`);
    mostrarCarrito();
}

// Eliminar del carrito
function eliminarDelCarrito(id) {
    const index = carrito.findIndex(r => r.id === id);
    if (index !== -1) {
        const [comida] = carrito.splice(index, 1);
        alert(`${comida.nombre} ha sido eliminado del carrito.`);
        mostrarCarrito();
    }
}

// Mostrar el carrito
function mostrarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = '';

    if (carrito.length === 0) {
        carritoDiv.innerHTML = 'el carrito esta vacio';
        return;
    }

    carrito.forEach(comida => {
        const itemDiv = crearElemento('div', 'carrito-item');
        itemDiv.innerHTML = `
            <h2>${comida.nombre}</h2>
            <p>Precio: $${comida.precio}</p>
            <button onclick="eliminarDelCarrito(${comida.id})">Eliminar</button>
        `;
        carritoDiv.appendChild(itemDiv);
    });

    const total = carrito.reduce((sum, comida) => sum + comida.precio, 0);
    const totalDiv = crearElemento('div', 'total', `<h2>Total: $${total}</h2>`);
    carritoDiv.appendChild(totalDiv);

    const opcionesDiv = crearElemento('div', 'opciones');
    opcionesDiv.innerHTML = `
        <label>
            <input type="radio" name="entrega" value="retiro" checked onclick="toggleOpcionesEntrega(false)"> Retiro en el local
        </label>
        <label>
            <input type="radio" name="entrega" value="delivery" onclick="toggleOpcionesEntrega(true)"> Delivery
        </label>
    `;
    carritoDiv.appendChild(opcionesDiv);

    const nombreDiv = crearElemento('div', 'nombre');
    nombreDiv.innerHTML = `
        <label for="nombre">Nombre para el retiro:</label>
        <input type="text" id="nombre" placeholder="Ingresa tu nombre">
    `;
    carritoDiv.appendChild(nombreDiv);

    const direccionDiv = crearElemento('div', 'direccion');
    direccionDiv.innerHTML = `
        <label for="direccion">Dirección de entrega:</label>
        <input type="text" id="direccion" placeholder="Ingresa tu dirección" disabled>
    `;
    carritoDiv.appendChild(direccionDiv);

    const enviarDiv = crearElemento('div', 'enviar');
    enviarDiv.innerHTML = `
        <button onclick="enviarPedido()">Enviar Pedido</button>
    `;
    carritoDiv.appendChild(enviarDiv);
}

// Habilitar/deshabilitar campos según la opción de entrega
function toggleOpcionesEntrega(delivery) {
    document.getElementById('direccion').disabled = !delivery;
    document.getElementById('nombre').disabled = delivery;
}

// Enviar pedido por WhatsApp
function enviarPedido() {
    const numeroWhatsApp = '+542302344813';
    const tipoEntrega = document.querySelector('input[name="entrega"]:checked').value;
    let mensajeCompleto;

    if (tipoEntrega === 'delivery') {
        const direccion = document.getElementById('direccion').value.trim();
        if (!direccion) {
            alert('Por favor, ingresa una dirección para la entrega.');
            return;
        }
        const mensaje = carrito.map(comida => `${comida.nombre} - $${comida.precio}`).join('\n');
        const total = carrito.reduce((sum, comida) => sum + comida.precio, 0);
        mensajeCompleto = `Hola, me gustaría ordenar:\n${mensaje}\nTotal: $${total}\nTipo de entrega: Delivery\nDirección: ${direccion}`;
    } else {
        const nombre = document.getElementById('nombre').value.trim();
        if (!nombre) {
            alert('Por favor, ingresa tu nombre para el retiro.');
            return;
        }
        const mensaje = carrito.map(comida => `${comida.nombre} - $${comida.precio}`).join('\n');
        const total = carrito.reduce((sum, comida) => sum + comida.precio, 0);
        mensajeCompleto = `Hola, me gustaría ordenar:\n${mensaje}\nTotal: $${total}\nTipo de entrega: Retiro en el local\nNombre para el retiro: ${nombre}`;
    }

    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensajeCompleto)}`;
    window.open(urlWhatsApp, '_blank');
}

// Filtrar productos por nombre
function filtrarProductos() {
    const busqueda = document.getElementById('buscar').value.toLowerCase();
    const productosFiltrados = mercaderia.filter(comida =>
        comida.nombre.toLowerCase().includes(busqueda)
    );
    mostrarProductos(productosFiltrados);
}

// Mostrar modal de login
function mostrarLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

// Cerrar modal de login
function cerrarLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Login del administrador
function login() {
    const user = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPassword').value;
    if (user === adminCredentials.user && password === adminCredentials.password) {
        document.getElementById('admin').style.display = 'block';
        cerrarLoginModal();
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos();
    mostrarProductosAdmin();
    mostrarCarrito();
});

