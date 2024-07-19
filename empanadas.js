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
    const productosGuardados = localStorage.getItem('empanadas');
    if (productosGuardados) {
        mercaderia = JSON.parse(productosGuardados);
        nextId = Math.max(...mercaderia.map(p => p.id)) + 1;
        mostrarProductos();
        mostrarProductosAdmin();
    } else {
        fetch('./productos_empanadas.json')
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
    localStorage.setItem('empanadas', JSON.stringify(mercaderia));
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
    productos.forEach(empanada => {
        const empanadaDiv = crearElemento('div', 'card');
        empanadaDiv.innerHTML = `
            <img src="../assets/img/jamon y queso.jpg" alt="${empanada.nombre}">
            <div class="card-content">
                <h2>${empanada.nombre}</h2>
                <p>Precio: $${empanada.precio}</p>
                <p>Stock: ${empanada.stock}</p>
                <button class="btnAgregarCarrito" data-id="${empanada.id}">Agregar al Carrito</button>
            </div>
        `;
        productosDiv.appendChild(empanadaDiv);
    });

    // Añadir event listeners a los botones
    document.querySelectorAll('.btnAgregarCarrito').forEach(button => {
        button.addEventListener('click', () => {
            agregarCarrito(button.dataset.id);
        });
    });
}

// Mostrar productos en la sección de administración
function mostrarProductosAdmin() {
    const listaAdmin = document.getElementById('listaAdmin');
    listaAdmin.innerHTML = '';
    mercaderia.forEach(empanada => {
        const itemAdmin = crearElemento('div', 'admin-item');
        itemAdmin.innerHTML = `
            <input type="text" value="${empanada.nombre}" data-id="${empanada.id}" data-campo="nombre" class="inputModificarProducto">
            <input type="number" value="${empanada.precio}" data-id="${empanada.id}" data-campo="precio" class="inputModificarProducto">
            <input type="number" value="${empanada.stock}" data-id="${empanada.id}" data-campo="stock" class="inputModificarProducto">
            <button class="btnEliminarProducto" data-id="${empanada.id}">Eliminar</button>
        `;
        listaAdmin.appendChild(itemAdmin);
    });

    // Añadir event listeners a los inputs y botones
    document.querySelectorAll('.inputModificarProducto').forEach(input => {
        input.addEventListener('change', (event) => {
            const id = parseInt(input.dataset.id);
            const campo = input.dataset.campo;
            const valor = event.target.value;
            modificarProducto(id, campo, valor);
        });
    });

    document.querySelectorAll('.btnEliminarProducto').forEach(button => {
        button.addEventListener('click', () => {
            eliminarProducto(button.dataset.id);
        });
    });
}

// Agregar nuevo producto
document.getElementById('btnAgregarProducto').addEventListener('click', agregarProducto);

function agregarProducto() {
    const nombre = document.getElementById('nuevoNombre').value.trim();
    const precio = parseInt(document.getElementById('nuevoPrecio').value.trim());
    const stock = parseInt(document.getElementById('nuevoStock').value.trim());
    if (nombre && !isNaN(precio) && precio > 0 && !isNaN(stock) && stock >= 0) {
        const nuevaEmpanada = { id: nextId++, nombre, precio, stock };
        mercaderia.push(nuevaEmpanada);
        guardarProductos();
        mostrarProductos();
        mostrarProductosAdmin();
        document.getElementById('nuevoNombre').value = '';
        document.getElementById('nuevoPrecio').value = '';
        document.getElementById('nuevoStock').value = '';
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingresa un nombre válido, un precio mayor que cero y un stock válido.',
        });
    }
}

// Modificar producto
function modificarProducto(id, campo, valor) {
    const producto = mercaderia.find(e => e.id === id);
    if (producto) {
        producto[campo] = campo === 'precio' || campo === 'stock' ? parseInt(valor) : valor;
        guardarProductos();
        mostrarProductos();
        mostrarProductosAdmin();
    }
}

// Eliminar producto
function eliminarProducto(id) {
    const index = mercaderia.findIndex(e => e.id == id);
    if (index !== -1) {
        mercaderia.splice(index, 1);
        guardarProductos();
        mostrarProductos();
        mostrarProductosAdmin();
        Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El producto ha sido eliminado exitosamente.',
        });
    }
}

// Agregar al carrito
function agregarCarrito(id) {
    const empanada = mercaderia.find(e => e.id == id);
    if (empanada.stock > 0) {
        carrito.push(empanada);
        empanada.stock--;
        guardarProductos();
        Swal.fire({
            icon: 'success',
            title: 'Agregado',
            text: `${empanada.nombre} se agregó a tu carrito.`,
        });
        mostrarProductos();
        mostrarCarrito();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Sin Stock',
            text: 'Lo sentimos, no hay stock disponible.',
        });
    }
}

// Eliminar del carrito
function eliminarDelCarrito(index) {
    const empanada = carrito[index];
    carrito.splice(index, 1);
    const producto = mercaderia.find(e => e.id == empanada.id);
    producto.stock++;
    guardarProductos();
    mostrarProductos();
    mostrarCarrito();
    Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El producto ha sido eliminado del carrito.',
    });
}
// Agregar event listener para mostrar/ocultar el carrito
document.getElementById('toggleCarrito').addEventListener('click', () => {
    const carritoContainer = document.getElementById('carritoContainer');
    carritoContainer.style.display = carritoContainer.style.display === 'none' ? 'block' : 'none';
});
// Mostrar carrito
function mostrarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = '';
    carrito.forEach((empanada, index) => {
        const itemCarrito = crearElemento('div', 'carrito-item');
        itemCarrito.innerHTML = `
            <p>${empanada.nombre} - $${empanada.precio}</p>
            <button class="btnEliminarCarrito" data-index="${index}">Eliminar</button>
        `;
        carritoDiv.appendChild(itemCarrito);
    });

    // Añadir event listeners a los botones de eliminar del carrito
    document.querySelectorAll('.btnEliminarCarrito').forEach(button => {
        button.addEventListener('click', () => {
            eliminarDelCarrito(button.dataset.index);
        });
    });

    const total = carrito.reduce((acc    , empanada) => acc + empanada.precio, 0);
    const totalDiv = crearElemento('div', 'total', `Total: $${total}`);
    carritoDiv.appendChild(totalDiv);
}

// Modo oscuro
document.getElementById('toggleDarkMode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('.card').forEach(card => card.classList.toggle('dark-mode'));
    document.querySelectorAll('.admin-item').forEach(item => item.classList.toggle('dark-mode'));
    document.querySelectorAll('.carrito-item').forEach(item => item.classList.toggle('dark-mode'));
    document.querySelectorAll('.total').forEach(item => item.classList.toggle('dark-mode'));
    document.querySelectorAll('.opciones label').forEach(label => label.classList.toggle('dark-mode'));
    document.querySelectorAll('.opciones input').forEach(input => input.classList.toggle('dark-mode'));
    document.querySelectorAll('.nombre input').forEach(input => input.classList.toggle('dark-mode'));
    document.querySelectorAll('.direccion input').forEach(input => input.classList.toggle('dark-mode'));
    document.querySelectorAll('.enviar-whatsapp').forEach(button => button.classList.toggle('dark-mode'));
});

// Login
function login() {
    const user = document.getElementById('adminUser').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    if (user === 'admin' && password === 'admin') {
        document.getElementById('admin').style.display = 'block';
        document.getElementById('loginModal').style.display = 'none';
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario o contraseña incorrectos.',
        });
    }
}

function cerrarLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
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
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `por favor proporcione nombre de entrega.`,
        });
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

cargarProductos();

