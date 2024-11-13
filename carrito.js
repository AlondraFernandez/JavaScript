// Carrito y horarios disponibles (eliminado la lógica de horarios)
let carrito = [];

// Cargar carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado); // Parsear JSON
    }
    actualizarCarrito();
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Convertir a JSON
}

// Agregar productos al carrito y mostrar alerta
function agregarAlCarrito(nombre, precio, cantidad) {
    if (cantidad <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad no válida',
            text: 'La cantidad debe ser mayor que 0.',
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    const itemExistente = carrito.find(item => item.nombre === nombre);
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio, cantidad });
    }
    registrarVenta(nombre, precio, cantidad);
    actualizarCarrito();
    guardarCarrito();
    Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `${cantidad} ${nombre} ha sido agregado al carrito.`,
        showConfirmButton: false,
        timer: 1500
    });
    const carritoContainer = document.getElementById('carrito-container');
    carritoContainer.style.display = 'block';
}

// Función para registrar venta
function registrarVenta(nombre, precio, cantidad) {
    const ventasGuardadas = localStorage.getItem('ventas');
    let ventas = ventasGuardadas ? JSON.parse(ventasGuardadas) : [];
    ventas.push({ producto: nombre, precio, cantidad });
    localStorage.setItem('ventas', JSON.stringify(ventas));
}

// Actualizar visualización del carrito
function actualizarCarrito() {
    const carritoLista = document.getElementById('carrito-lista');
    carritoLista.innerHTML = '';
    let total = 0;
    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.nombre} - $${item.precio} x ${item.cantidad} 
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>`;
        carritoLista.appendChild(li);
        total += item.precio * item.cantidad;
    });
    document.getElementById('total').textContent = `Total: $${total}`;
}

// Alternar visibilidad del carrito
function toggleCarrito() {
    const carritoContainer = document.getElementById('carrito-container');
    if (carritoContainer.style.display === 'none' || carritoContainer.style.display === '') {
        carritoContainer.style.display = 'block';
    } else {
        carritoContainer.style.display = 'none';
    }
    localStorage.setItem('carritoAbierto', carritoContainer.style.display === 'block');
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    guardarCarrito();
}

// Elimino el manejo de la selección de horarios


// Mostrar/ocultar campo de ubicación según el tipo de entrega
document.querySelectorAll('input[name="entrega"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const ubicacionContainer = document.getElementById('ubicacion-container');
        if (this.value === 'Delivery') {
            ubicacionContainer.style.display = 'block';
        } else {
            ubicacionContainer.style.display = 'none';
        }
    });
});

// Enviar pedido por WhatsApp
function enviarPedido() {
    const nombre = document.getElementById('nombre').value;
    if (!nombre) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, ingrese su nombre.'
        });
        return;
    }
    
    // Obtener la opción de entrega (Delivery o Retiro en el local)
    const entrega = document.querySelector('input[name="entrega"]:checked').value;
    let ubicacion = '';
    if (entrega === 'Delivery') {
        // Si es Delivery, pedimos la dirección
        ubicacion = document.getElementById('ubicacion').value;
        if (!ubicacion) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, ingrese su dirección.'
            });
            return;
        }
    }

    // Preparar los productos del carrito
    const carritoTexto = carrito.map(item => `${item.nombre} - $${item.precio} x ${item.cantidad}`).join(', ');
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // Crear el mensaje
    let mensaje = `Pedido de ${nombre}\nProductos: ${carritoTexto}\nTotal: $${total}\nEntrega: ${entrega}`;
    
    // Si es Delivery, incluir la ubicación
    if (entrega === 'Delivery' && ubicacion) {
        mensaje += `\nUbicación: ${ubicacion}`;
    } else if (entrega === 'Retiro') {
        // Si es Retiro, agregar la nota de que es para retirar en el local
        mensaje += `\nRetiro en el local`;
    }

    // Enviar mensaje por WhatsApp
    const whatsappUrl = `https://wa.me/542302344813?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
}

// Añadir event listener a los botones de agregar al carrito
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.agregar-al-carrito').forEach(button => {
        button.addEventListener('click', function() {
            const nombre = this.getAttribute('data-nombre');
            const precio = parseFloat(this.getAttribute('data-precio'));
            const id = this.getAttribute('data-id');
            const cantidad = parseInt(document.getElementById(`cantidad-producto-${id}`).value);
            agregarAlCarrito(nombre, precio, cantidad);
        });
    });
    cargarCarrito();
    const carritoAbierto = localStorage.getItem('carritoAbierto');
    if (carritoAbierto === 'true') {
        document.getElementById('carrito-container').style.display = 'block';
    }
});

function toggleCarrito() {
    const carritoContainer = document.getElementById('carrito-container');
    carritoContainer.style.display = carritoContainer.style.display === 'none' ? 'block' : 'none';
}

function filtrarProductos() {
    const query = document.getElementById('buscar').value.toLowerCase();
    const productos = document.querySelectorAll('#productos-container .producto');

    productos.forEach(producto => {
        const nombre = producto.querySelector('.card-title').textContent.toLowerCase();
        producto.style.display = nombre.includes(query) ? 'block' : 'none';
    });
}

// Mostrar campo de ubicación si es Delivery
document.querySelectorAll('input[name="entrega"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const ubicacionContainer = document.getElementById('ubicacion-container');
        ubicacionContainer.style.display = this.value === 'Delivery' ? 'block' : 'none';
    });
});





function toggleCarrito() {
    const carritoContainer = document.getElementById('carrito-container');
    carritoContainer.style.display = carritoContainer.style.display === 'none' ? 'block' : 'none';
}

function filtrarProductos() {
    const query = document.getElementById('buscar').value.toLowerCase();
    const productos = document.querySelectorAll('#productos-container .producto');

    productos.forEach(producto => {
        const nombre = producto.querySelector('.card-title').textContent.toLowerCase();
        producto.style.display = nombre.includes(query) ? 'block' : 'none';
    });
}

// Mostrar campo de ubicación si es Delivery
document.querySelectorAll('input[name="entrega"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const ubicacionContainer = document.getElementById('ubicacion-container');
        ubicacionContainer.style.display = this.value === 'Delivery' ? 'block' : 'none';
    });
});


 /*client.js
const cart = [];

function displayProducts() {
  const productContainer = document.getElementById('product-list');
  productContainer.innerHTML = '';
  
  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.innerHTML = `
      <div>${product.name} - $${product.price}</div>
      ${product.stock > 0 ? 
        `<button onclick="addToCart(${product.id})">Agregar al carrito</button>` : 
        `<button disabled>Sin stock</button>`
      }
    `;
    productContainer.appendChild(productElement);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product && product.stock > 0) {
    const cartItem = cart.find(item => item.id === product.id);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    product.stock -= 1;
    displayProducts();
    displayCart();
    saveCart();
  } else {
    alert('No hay stock disponible');
  }
}

function displayCart() {
  const cartContainer = document.getElementById('cart');
  cartContainer.innerHTML = '';
  
  cart.forEach(item => {
    const cartItemElement = document.createElement('div');
    cartItemElement.innerHTML = `
      <div>${item.name} - $${item.price} x ${item.quantity}</div>
      <button onclick="removeFromCart(${item.id})">Eliminar</button>
    `;
    cartContainer.appendChild(cartItemElement);
  });
}

function removeFromCart(productId) {
  const cartItemIndex = cart.findIndex(item => item.id === productId);
  if (cartItemIndex > -1) {
    const cartItem = cart[cartItemIndex];
    const product = products.find(p => p.id === productId);
    if (product) {
      product.stock += cartItem.quantity;
    }
    cart.splice(cartItemIndex, 1);
    displayProducts();
    displayCart();
    saveCart();
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', () => {
  const savedCart = JSON.parse(localStorage.getItem('cart'));
  if (savedCart) {
    savedCart.forEach(item => {
      cart.push(item);
    });
  }
  displayProducts();
  displayCart();
});*/