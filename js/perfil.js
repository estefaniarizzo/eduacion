class PerfilManager {
    constructor() {
        // Verificar autenticación
        if (!AuthManager.isLoggedIn()) {
            window.location.href = '/login.html';
            return;
        }
        
        this.init();
    }

    init() {
        this.cargarDatosUsuario();
        this.cargarEstadisticas();
        this.cargarProgresoCursos();
        this.configurarFormulario();
    }

    cargarDatosUsuario() {
        const usuario = AuthManager.getCurrentUser();
        if (!usuario) return;

        // Actualizar información en el perfil
        document.getElementById('nombre-usuario').textContent = usuario.nombre;
        document.getElementById('email-usuario').textContent = usuario.email;
        document.getElementById('grado-usuario').textContent = `${usuario.grado}° Grado`;

        // Llenar formulario de configuración
        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('email').value = usuario.email;
        document.getElementById('grado').value = usuario.grado;
    }

    cargarEstadisticas() {
        // Obtener estadísticas del localStorage
        const leccionesCompletadas = this.obtenerLeccionesCompletadas();
        const objetivosAlcanzados = this.obtenerObjetivosAlcanzados();
        const puntosTotales = this.calcularPuntosTotales();

        // Actualizar elementos en la página
        document.getElementById('lecciones-completadas').textContent = leccionesCompletadas;
        document.getElementById('objetivos-alcanzados').textContent = objetivosAlcanzados;
        document.getElementById('puntos-totales').textContent = puntosTotales;
    }

    cargarProgresoCursos() {
        const cursos = ['matematicas', 'ciencias', 'lectura'];
        
        cursos.forEach(curso => {
            const progreso = this.obtenerProgresoCurso(curso);
            const cursoCard = document.querySelector(`.curso-card:nth-child(${cursos.indexOf(curso) + 1})`);
            const barraProgreso = cursoCard.querySelector('.progreso');
            const textoProgreso = cursoCard.querySelector('p');

            barraProgreso.style.width = `${progreso}%`;
            textoProgreso.textContent = `${progreso}% completado`;
        });
    }

    configurarFormulario() {
        const form = document.getElementById('form-configuracion');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.actualizarPerfil();
        });
    }

    actualizarPerfil() {
        const usuario = AuthManager.getCurrentUser();
        if (!usuario) return;

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const grado = document.getElementById('grado').value;
        const password = document.getElementById('password').value;

        // Validar que el email no esté en uso por otro usuario
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const emailEnUso = usuarios.some(u => u.email === email && u.email !== usuario.email);

        if (emailEnUso) {
            this.mostrarFeedback('El correo electrónico ya está en uso', 'error');
            return;
        }

        // Actualizar datos del usuario
        usuario.nombre = nombre;
        usuario.email = email;
        usuario.grado = grado;

        if (password) {
            usuario.password = password; // En un caso real, deberíamos hashear la contraseña
        }

        // Actualizar en localStorage
        const index = usuarios.findIndex(u => u.email === usuario.email);
        if (index !== -1) {
            usuarios[index] = usuario;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        // Actualizar sesión actual
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));

        this.mostrarFeedback('Perfil actualizado correctamente');
        this.cargarDatosUsuario();
    }

    obtenerLeccionesCompletadas() {
        const lecciones = ['leccion1', 'leccion2', 'leccion3', 'leccion4', 'leccion5'];
        return lecciones.filter(leccion => {
            const progreso = localStorage.getItem(`progreso_/contenido/ciencias/${leccion}.html`);
            return progreso && parseInt(progreso) === 100;
        }).length;
    }

    obtenerObjetivosAlcanzados() {
        // En un caso real, esto vendría de una base de datos
        return Math.floor(Math.random() * 10) + 5;
    }

    calcularPuntosTotales() {
        // En un caso real, esto vendría de una base de datos
        return Math.floor(Math.random() * 1000) + 500;
    }

    obtenerProgresoCurso(curso) {
        // En un caso real, esto vendría de una base de datos
        return Math.floor(Math.random() * 100);
    }

    mostrarFeedback(mensaje, tipo = 'success') {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${tipo}`;
        feedback.textContent = mensaje;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const perfilManager = new PerfilManager();

    // Agregar estilos de feedback dinámicamente
    const style = document.createElement('style');
    style.textContent = `
        .feedback {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease-out;
            z-index: 1000;
        }

        .feedback.success {
            background: #4CAF50;
            color: white;
        }

        .feedback.error {
            background: #f44336;
            color: white;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}); 