let carrito = [];
const horariosDisponibles = {
    '19:30': true,
    '20:00': true,
    '20:30': true,
    '21:00': true,
    '21:30': true,
    '22:00': true,
    '22:30': true,
    '23:00': true
};

// Cargar carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    actualizarCarrito();
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agregar productos al carrito y mostrar alerta
function agregarAlCarrito(nombre, precio, cantidad) {
    const itemExistente = carrito.find(item => item.nombre === nombre);
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio, cantidad });
    }
    actualizarCarrito();
    guardarCarrito();
    Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `${nombre} ha sido agregado al carrito.`,
        showConfirmButton: false,
        timer: 1500
    });
    // Mantener el carrito abierto
    const carritoContainer = document.getElementById('carrito-container');
    carritoContainer.style.display = 'block';
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

// Manejar cambio de horario
document.getElementById('horarios').addEventListener('change', function() {
    const selectedTime = this.value;
    if (!horariosDisponibles[selectedTime]) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Este horario ya ha sido seleccionado. Por favor, elija otro.'
        });
        this.value = '';
    }
});

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
    const horario = document.getElementById('horarios').value;
    if (!horario) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, seleccione un horario.'
        });
        return;
    }
    if (!horariosDisponibles[horario]) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Este horario ya ha sido seleccionado. Por favor, elija otro.'
        });
        return;
    }
    horariosDisponibles[horario] = false;

    const entrega = document.querySelector('input[name="entrega"]:checked').value;
    let ubicacion = '';
    if (entrega === 'Delivery') {
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

    const carritoTexto = carrito.map(item => `${item.nombre} - $${item.precio} x ${item.cantidad}`).join(', ');
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    let mensaje = `Pedido de ${nombre}\nProductos: ${carritoTexto}\nTotal: $${total}\nHorario: ${horario}\nEntrega: ${entrega}`;
    if (ubicacion) {
        mensaje += `\nUbicación: ${ubicacion}`;
    }

    const whatsappURL = `https://wa.me/XXXXXXXXXXX?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappURL, '_blank');
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
