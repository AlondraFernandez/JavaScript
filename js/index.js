let mercaderia = [];
let carrito = [];
let nextId = 4; // Para asignar IDs únicos a los nuevos productos

// Credenciales de administrador
const adminCredentials = {
    user: 'admin',
    password: 'admin123'
};

// Cargar productos desde localStorage o JSON
function cargarProductos() {
    const productosGuardados = localStorage.getItem('mercaderia');
    if (productosGuardados) {
        mercaderia = JSON.parse(productosGuardados);
        nextId = Math.max(...mercaderia.map(p => p.id)) + 1;
        mostrarProductos();
        mostrarProductosAdmin();
    } else {
        fetch('./productos.json')
            .then(response => response.json())
            .then(data => {
                mercaderia = data;
                guardarProductos();
                mostrarProductos();
                mostrarProductosAdmin();
            });
    }
}

// Guardar productos en localStorage
function guardarProductos() {
    localStorage.setItem('mercaderia', JSON.stringify(mercaderia));
}

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
        guardarProductos();
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
        guardarProductos();
        mostrarProductos();
        mostrarProductosAdmin();
    }
}

// Eliminar producto
function eliminarProducto(id) {
    const index = mercaderia.findIndex(r => r.id === id);
    if (index !== -1) {
        mercaderia.splice(index, 1);
        guardarProductos();
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
        carritoDiv.innerHTML = '<p>El carrito está vacío</p>';
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

    const totalDiv = crearElemento('div', 'total', `Total: $${carrito.reduce((total, comida) => total + comida.precio, 0)}`);
    carritoDiv.appendChild(totalDiv);

    const opcionesDiv = crearElemento('div', 'opciones', `
        <label><input type="radio" name="entrega" value="retiro" onclick="mostrarOpcionesEntrega()"> Retiro en el Local</label>
        <label><input type="radio" name="entrega" value="delivery" onclick="mostrarOpcionesEntrega()"> Delivery</label>
    `);
    carritoDiv.appendChild(opcionesDiv);

    const nombreDiv = crearElemento('div', 'nombre', `<input type="text" id="nombreRetiro" placeholder="Nombre para retirar" style="display:none;">`);
    carritoDiv.appendChild(nombreDiv);

    const direccionDiv = crearElemento('div', 'direccion', `<input type="text" id="direccionDelivery" placeholder="Dirección de envío" style="display:none;">`);
    carritoDiv.appendChild(direccionDiv);
}

function mostrarOpcionesEntrega() {
    const retiroInput = document.getElementById('nombreRetiro');
    const deliveryInput = document.getElementById('direccionDelivery');
    const tipoEntrega = document.querySelector('input[name="entrega"]:checked').value;
    if (tipoEntrega === 'retiro') {
        retiroInput.style.display = 'block';
        deliveryInput.style.display = 'none';
    } else {
        retiroInput.style.display = 'none';
        deliveryInput.style.display = 'block';
    }
}

// Funciones de autenticación
function mostrarLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function cerrarLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function login() {
    const user = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPassword').value;
    if (user === adminCredentials.user && password === adminCredentials.password) {
        document.getElementById('admin').style.display = 'block';
        cerrarLoginModal();
    } else {
        alert('Credenciales incorrectas');
    }
}

// Filtrar productos
function filtrarProductos() {
    const filtro = document.getElementById('buscar').value.toLowerCase();
    const productosFiltrados = mercaderia.filter(comida => comida.nombre.toLowerCase().includes(filtro));
    mostrarProductos(productosFiltrados);
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', cargarProductos);
