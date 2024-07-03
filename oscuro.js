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