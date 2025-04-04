// Datos del curso (simulando una base de datos)
const cursoData = {
    id: 1,
    titulo: "Matemáticas Divertidas",
    progreso: 60,
    lecciones: [
        {
            id: 1,
            titulo: "Números del 1 al 10",
            descripcion: "Aprende a contar y reconocer los números básicos",
            estado: "completed",
            contenido: "contenido/leccion1.html"
        },
        {
            id: 2,
            titulo: "Sumas Simples",
            descripcion: "¡Suma números de una cifra de forma divertida!",
            estado: "completed",
            contenido: "contenido/leccion2.html"
        },
        {
            id: 3,
            titulo: "Restas Básicas",
            descripcion: "Aprende a restar números pequeños",
            estado: "current",
            contenido: "contenido/leccion3.html"
        },
        {
            id: 4,
            titulo: "Multiplicación",
            descripcion: "Descubre el mundo de la multiplicación",
            estado: "locked",
            contenido: "contenido/leccion4.html"
        }
    ],
    logros: [
        {
            id: 1,
            titulo: "Primera Lección",
            icono: "🌟",
            conseguido: true
        },
        {
            id: 2,
            titulo: "5 Ejercicios Perfectos",
            icono: "🎯",
            conseguido: true
        },
        {
            id: 3,
            titulo: "Curso Completado",
            icono: "🏆",
            conseguido: false
        }
    ]
};

// Clase principal para manejar el curso
class CursoManager {
    constructor(cursoData) {
        this.cursoData = cursoData;
        this.init();
    }

    init() {
        this.actualizarProgreso();
        this.cargarLecciones();
        this.cargarLogros();
        this.agregarEventListeners();
    }

    actualizarProgreso() {
        const progressBar = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-container span');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${this.cursoData.progreso}%`;
            progressText.textContent = `${this.cursoData.progreso}% Completado`;
        }
    }

    cargarLecciones() {
        const leccionesList = document.querySelector('.lecciones-list');
        if (!leccionesList) return;

        leccionesList.innerHTML = this.cursoData.lecciones.map(leccion => `
            <div class="leccion-item ${leccion.estado}">
                <div class="leccion-status">${this.getStatusIcon(leccion.estado)}</div>
                <div class="leccion-info">
                    <h3>${leccion.titulo}</h3>
                    <p>${leccion.descripcion}</p>
                </div>
                <a href="${leccion.contenido}" class="btn ${leccion.estado === 'locked' ? 'disabled' : ''}" 
                   data-leccion-id="${leccion.id}">
                    ${this.getButtonText(leccion.estado)}
                </a>
            </div>
        `).join('');
    }

    getStatusIcon(estado) {
        switch (estado) {
            case 'completed': return '✅';
            case 'current': return '📝';
            case 'locked': return '🔒';
            default: return '📍';
        }
    }

    getButtonText(estado) {
        switch (estado) {
            case 'completed': return 'Repasar';
            case 'current': return 'Continuar';
            case 'locked': return 'Bloqueado';
            default: return 'Comenzar';
        }
    }

    cargarLogros() {
        const logrosGrid = document.querySelector('.logros-grid');
        if (!logrosGrid) return;

        logrosGrid.innerHTML = this.cursoData.logros.map(logro => `
            <div class="logro-item ${logro.conseguido ? 'achieved' : ''}">
                <span class="logro-icon">${logro.icono}</span>
                <p>${logro.titulo}</p>
            </div>
        `).join('');
    }

    agregarEventListeners() {
        // Manejar clics en las lecciones
        document.querySelectorAll('.leccion-item .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.classList.contains('disabled')) {
                    e.preventDefault();
                    this.mostrarMensaje('¡Completa las lecciones anteriores primero!');
                    return;
                }

                const leccionId = parseInt(btn.dataset.leccionId);
                this.abrirLeccion(leccionId, e);
            });
        });

        // Manejar clics en los recursos
        document.querySelectorAll('.recursos-list a').forEach(recurso => {
            recurso.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrarMensaje('¡Recurso disponible próximamente!');
            });
        });
    }

    abrirLeccion(leccionId, event) {
        event.preventDefault();
        const leccion = this.cursoData.lecciones.find(l => l.id === leccionId);
        
        if (leccion.estado === 'locked') {
            this.mostrarMensaje('Esta lección está bloqueada.');
            return;
        }

        // Aquí se implementaría la lógica para cargar el contenido de la lección
        this.mostrarMensaje(`Cargando lección: ${leccion.titulo}...`);
        // Simular carga de lección
        setTimeout(() => {
            window.location.href = leccion.contenido;
        }, 1500);
    }

    mostrarMensaje(mensaje) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = mensaje;
        document.body.appendChild(toast);

        // Eliminar el mensaje después de 3 segundos
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Estilos para los mensajes toast
const style = document.createElement('style');
style.textContent = `
    .toast-message {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
        from {
            transform: translate(-50%, 100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Inicializar el gestor del curso cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const cursoManager = new CursoManager(cursoData);
}); 