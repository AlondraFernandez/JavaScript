let empanadas = [];
let carrito = [];
let nextId = 4; // Para asignar IDs únicos a los nuevos productos

// Cargar productos desde localStorage o JSON
function cargarProductos() {
    const productosGuardados = localStorage.getItem('empanadas');
    if (productosGuardados) {
        mercaderia = JSON.parse(productosGuardados);
        nextId = Math.max(...mercaderia.map(p => p.id)) + 1;
        mostrarProductos();
    } else {
        fetch('./productos_empanadas.json')
            .then(response => response.json())
            .then(data => {
                mercaderia = data;
                guardarProductos();
                mostrarProductos();
            });
    }
}

// Guardar productos en localStorage
function guardarProductos() {
    localStorage.setItem('mercaderia', JSON.stringify(mercaderia));
}

// Mostrar productos disponibles
function mostrarProductos(productos = mercaderia) {
    const productosDiv = document.getElementById('productos');
    productosDiv.innerHTML = '';
    productos.forEach(empanada => {
        const empanadaDiv = document.createElement('div');
        empanadaDiv.classList.add('card');
        empanadaDiv.innerHTML = `
            <img src="../assets/img/foto-cocinero.jpeg"${empanada.id}.jpg" alt="${empanada.nombre}">
            <div class="card-content">
                <h2>${empanada.nombre}</h2>
                <p>Precio: $${empanada.precio}</p>
                <button onclick="agregarCarrito(${empanada.id})">Agregar al Carrito</button>
            </div>
        `;
        productosDiv.appendChild(empanadaDiv);
    });
}

// Agregar al carrito
function agregarCarrito(id) {
    const empanada = mercaderia.find(e => e.id === id);
    carrito.push(empanada);
    alert(`${empanada.nombre} se agregó a tu carrito.`);
    mostrarCarrito();
}

// Función para mostrar el carrito
function mostrarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = '';

    if (carrito.length === 0) {
        carritoDiv.innerHTML = '<p>El carrito está vacío</p>';
        return;
    }

    carrito.forEach(empanada => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('carrito-item');
        itemDiv.innerHTML = `
            <h2>${empanada.nombre}</h2>
            <p>Precio: $${empanada.precio}</p>
            <button onclick="eliminarDelCarrito(${empanada.id})">Eliminar</button>
        `;
        carritoDiv.appendChild(itemDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('total');
    totalDiv.textContent = `Total: $${calcularTotalCarrito()}`;
    carritoDiv.appendChild(totalDiv);

    const opcionesDiv = document.createElement('div');
    opcionesDiv.classList.add('opciones');
    opcionesDiv.innerHTML = `
        <label><input type="radio" name="entrega" value="retiro" onclick="mostrarOpcionesEntrega()"> Retiro en el Local</label>
        <label><input type="radio" name="entrega" value="delivery" onclick="mostrarOpcionesEntrega()"> Delivery</label>
    `;
    carritoDiv.appendChild(opcionesDiv);

    const nombreDiv = document.createElement('div');
    nombreDiv.classList.add('nombre');
    nombreDiv.innerHTML = `<input type="text" id="nombreRetiro" placeholder="Nombre para retirar" style="display:none;">`;
    carritoDiv.appendChild(nombreDiv);

    const direccionDiv = document.createElement('div');
    direccionDiv.classList.add('direccion');
    direccionDiv.innerHTML = `<input type="text" id="direccionDelivery" placeholder="Dirección de envío" style="display:none;">`;
    carritoDiv.appendChild(direccionDiv);

    const enviarWhatsappBtn = document.createElement('button');
    enviarWhatsappBtn.classList.add('enviar-whatsapp');
    enviarWhatsappBtn.textContent = 'Enviar Pedido por WhatsApp';
    enviarWhatsappBtn.onclick = enviarPedidoWhatsapp;
    carritoDiv.appendChild(enviarWhatsappBtn);
}

// Eliminar del carrito
function eliminarDelCarrito(id) {
    const index = carrito.findIndex(e => e.id === id);
    if (index !== -1) {
        const [empanada] = carrito.splice(index, 1);
        alert(`${empanada.nombre} ha sido eliminado del carrito.`);
        mostrarCarrito();
    }
}

// Calcular el total del carrito
function calcularTotalCarrito() {
    return carrito.reduce((total, empanada) => total + empanada.precio, 0);
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
    let mensaje = 'Pedido de Empanadas:\n\n';

    carrito.forEach(empanada => {
        mensaje += `${empanada.nombre} - $${empanada.precio}\n`;
    });

    const total = calcularTotalCarrito();
    mensaje += `\nTotal: $${total}\n\n`;

    if (entregaSeleccionada === 'retiro') {
        mensaje += `Nombre para retirar: ${nombreEntrega}`;
    } else if (entregaSeleccionada === 'delivery') {
        mensaje += `Dirección de envío: ${nombreEntrega}`;
    }

    const urlMensaje = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(mensaje)}`;
    window.open(urlMensaje, '_blank');
}

// Funciones de autenticación (similares a las de pizzas.js)
function mostrarLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function cerrarLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function login() {
    const user = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPassword').value;
    if (user === 'admin' && password === 'admin123') {
        document.getElementById('admin').style.display = 'block';
        cerrarLoginModal();
    } else {
        alert('Credenciales incorrectas');
    }
}

// Filtrar productos (si es necesario implementarlo para empanadas)
function filtrarProductos() {
    const filtro = document.getElementById('buscar').value.toLowerCase();
    const productosFiltrados = mercaderia.filter(empanada => empanada.nombre.toLowerCase().includes(filtro));
    mostrarProductos(productosFiltrados);
}

// Alternar modo oscuro (si es necesario implementarlo para empanadas)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.toggle('dark-mode'));

    const carritoItems = document.querySelectorAll('.carrito-item');
    carritoItems.forEach(item => item.classList.toggle('dark-mode'));

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

    cargarProductos();
});