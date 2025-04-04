// Funcionalidad del menú móvil
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });

    // Animación de scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animación de elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .section-title').forEach(el => {
        observer.observe(el);
    });
});

// Funcionalidad de inicio de sesión
function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Aquí iría la lógica de autenticación
    console.log('Datos de inicio de sesión:', Object.fromEntries(formData));
}

// Funcionalidad de registro
function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Aquí iría la lógica de registro
    console.log('Datos de registro:', Object.fromEntries(formData));
}

// Funcionalidad de progreso
function updateProgress(courseId, progress) {
    // Aquí iría la lógica para actualizar el progreso del curso
    console.log(`Progreso actualizado para el curso ${courseId}: ${progress}%`);
}

// Funcionalidad de logros
function checkAchievements() {
    // Aquí iría la lógica para verificar y otorgar logros
    console.log('Verificando logros...');
} 