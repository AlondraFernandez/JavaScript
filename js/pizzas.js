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
        const productoDiv = crearElemento('div', 'card');
        productoDiv.innerHTML = `
            <img src="ruta/a/la/imagen/${comida.id}.jpg" alt="${comida.nombre}">
            <div class="card-content">
                <h2>${comida.nombre}</h2>
                <p>Precio: $${comida.precio}</p>
                <button onclick="agregarCarrito(${comida.id})">Agregar al Carrito</button>
            </div>
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

    const enviarWhatsappBtn = crearElemento('button', 'enviar-whatsapp', 'Enviar Pedido por WhatsApp');
    enviarWhatsappBtn.onclick = enviarPedidoWhatsapp;
    carritoDiv.appendChild(enviarWhatsappBtn);
}

// Mostrar opciones de entrega
function mostrarOpcionesEntrega() {
    const entregaSeleccionada = document.querySelector('input[name="entrega"]:checked').value;
    document.getElementById('nombreRetiro').style.display = entregaSeleccionada === 'retiro' ? 'block' : 'none';
    document.getElementById('direccionDelivery').style.display = entregaSeleccionada === 'delivery' ? 'block' : 'none';
}

// Enviar pedido por WhatsApp
function enviarPedidoWhatsapp() {
    const entregaSeleccionada = document.querySelector('input[name="entrega"]:checked').value;
    const nombreEntrega = entregaSeleccionada === 'retiro' ? document.getElementById('nombreRetiro').value.trim() : document.getElementById('direccionDelivery').value.trim();

    if (!nombreEntrega) {
        alert('Por favor, proporciona la información de entrega.');
        return;
    }

    const numeroWhatsapp = 'TU_NUMERO_DE_WHATSAPP';
    let mensaje = 'Pedido de Pizzas:\n\n';

    carrito.forEach(comida => {
        mensaje += `${comida.nombre} - $${comida.precio}\n`;
    });

    const total = carrito.reduce((total, comida) => total + comida.precio, 0);
    mensaje += `\nTotal: $${total}\n\n`;

    if (entregaSeleccionada === 'retiro') {
        mensaje += `Nombre para retirar: ${nombreEntrega}`;
    } else if (entregaSeleccionada === 'delivery') {
        mensaje += `Dirección de envío: ${nombreEntrega}`;
    }

    const urlMensaje = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(mensaje)}`;
    window.open(urlMensaje, '_blank');
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
// Alternar modo oscuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.toggle('dark-mode'));

    const adminItems = document.querySelectorAll('.admin-item');
    adminItems.forEach(item => item.classList.toggle('dark-mode'));

    const carritoItems = document.querySelectorAll('.carrito-item');
    carritoItems.forEach(item => item.classList.toggle('dark-mode'));

    const totalDiv = document.querySelector('.total');
    if (totalDiv) totalDiv.classList.toggle('dark-mode');

    const opcionesDiv = document.querySelector('.opciones');
    if (opcionesDiv) opcionesDiv.classList.toggle('dark-mode');

    const nombreDiv = document.querySelector('.nombre input');
    if (nombreDiv) nombreDiv.classList.toggle('dark-mode');

    const direccionDiv = document.querySelector('.direccion input');
    if (direccionDiv) direccionDiv.classList.toggle('dark-mode');

    const enviarWhatsappBtn = document.querySelector('.enviar-whatsapp');
    if (enviarWhatsappBtn) enviarWhatsappBtn.classList.toggle('dark-mode');

    // Guardar preferencia en localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Verificar preferencia de modo oscuro al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        toggleDarkMode();
    }
    document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);
});

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', cargarProductos);
