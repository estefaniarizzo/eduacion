class LeccionManager {
    constructor() {
        // Verificar autenticación
        if (!AuthManager.isLoggedIn()) {
            window.location.href = '/login.html';
            return;
        }
        
        this.init();
    }

    init() {
        this.configurarNavegacion();
        this.configurarEjercicios();
        this.actualizarProgreso();
    }

    configurarNavegacion() {
        const btnPrev = document.querySelector('.btn-prev');
        const btnNext = document.querySelector('.btn-next');

        if (btnPrev) {
            btnPrev.addEventListener('click', () => this.navegarLeccion('prev'));
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => this.navegarLeccion('next'));
        }
    }

    configurarEjercicios() {
        // Configurar ejercicios de arrastrar y soltar
        const elementosArrastrables = document.querySelectorAll('[draggable="true"]');
        const zonas = document.querySelectorAll('.zona, .zona-etapa, .zona-polinizacion');

        elementosArrastrables.forEach(elemento => {
            elemento.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', elemento.dataset.tipo || elemento.dataset.etapa || elemento.dataset.necesidad);
                elemento.classList.add('arrastrando');
            });

            elemento.addEventListener('dragend', () => {
                elemento.classList.remove('arrastrando');
            });
        });

        zonas.forEach(zona => {
            zona.addEventListener('dragover', (e) => {
                e.preventDefault();
                zona.classList.add('sobre');
            });

            zona.addEventListener('dragleave', () => {
                zona.classList.remove('sobre');
            });

            zona.addEventListener('drop', (e) => {
                e.preventDefault();
                zona.classList.remove('sobre');
                
                const tipo = e.dataTransfer.getData('text/plain');
                const elemento = document.querySelector('.arrastrando');
                
                if (tipo === zona.dataset.tipo || tipo === zona.dataset.etapa || tipo === zona.dataset.necesidad) {
                    const zonaContenido = zona.querySelector('.zona-contenido') || zona;
                    zonaContenido.appendChild(elemento);
                    this.verificarEjercicio();
                }
            });
        });

        // Configurar ejercicios de partes de planta y flor
        const partes = document.querySelectorAll('.parte-planta, .parte-flor');
        partes.forEach(parte => {
            parte.addEventListener('click', () => {
                parte.classList.toggle('seleccionada');
                this.verificarEjercicio();
            });
        });

        // Configurar ejercicio de polinización
        const zonaPolinizacion = document.querySelector('.zona-polinizacion');
        if (zonaPolinizacion) {
            zonaPolinizacion.addEventListener('dragover', (e) => {
                e.preventDefault();
                zonaPolinizacion.classList.add('sobre');
            });

            zonaPolinizacion.addEventListener('dragleave', () => {
                zonaPolinizacion.classList.remove('sobre');
            });

            zonaPolinizacion.addEventListener('drop', (e) => {
                e.preventDefault();
                zonaPolinizacion.classList.remove('sobre');
                
                const tipo = e.dataTransfer.getData('text/plain');
                const elemento = document.querySelector('.arrastrando');
                
                if (elemento.classList.contains('polinizador')) {
                    zonaPolinizacion.appendChild(elemento);
                    this.verificarEjercicio();
                }
            });
        }
    }

    verificarEjercicio() {
        const ejercicioActual = document.querySelector('.ejercicio:not(.completado)');
        if (!ejercicioActual) return;

        let completado = false;

        // Verificar clasificación
        if (ejercicioActual.id === 'ejercicio1') {
            const zonas = ejercicioActual.querySelectorAll('.zona');
            completado = Array.from(zonas).every(zona => {
                const elementos = zona.querySelectorAll('.ser-vivo, .animal');
                return elementos.length > 0;
            });
        }

        // Verificar partes de planta
        if (ejercicioActual.id === 'ejercicio1' && ejercicioActual.querySelector('.planta-diagrama')) {
            const partes = ejercicioActual.querySelectorAll('.parte-planta');
            completado = Array.from(partes).every(parte => parte.classList.contains('seleccionada'));
        }

        // Verificar partes de flor
        if (ejercicioActual.id === 'ejercicio2') {
            const partes = ejercicioActual.querySelectorAll('.parte-flor');
            completado = Array.from(partes).every(parte => parte.classList.contains('seleccionada'));
        }

        // Verificar ciclo de vida
        if (ejercicioActual.id === 'ejercicio1' && ejercicioActual.querySelector('.ciclo-vida-container')) {
            const etapas = ejercicioActual.querySelectorAll('.zona-etapa');
            completado = Array.from(etapas).every(etapa => {
                const elementos = etapa.querySelectorAll('.etapa');
                return elementos.length === 1;
            });
        }

        // Verificar polinización
        if (ejercicioActual.id === 'ejercicio3') {
            const zonaPolinizacion = ejercicioActual.querySelector('.zona-polinizacion');
            completado = zonaPolinizacion && zonaPolinizacion.children.length > 0;
        }

        if (completado) {
            ejercicioActual.classList.add('completado');
            this.mostrarFeedback('¡Excelente! Has completado el ejercicio.');
            this.actualizarProgreso();
        }
    }

    mostrarFeedback(mensaje) {
        const feedback = document.createElement('div');
        feedback.className = 'feedback';
        feedback.textContent = mensaje;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    actualizarProgreso() {
        const ejercicios = document.querySelectorAll('.ejercicio');
        const ejerciciosCompletados = document.querySelectorAll('.ejercicio.completado');
        const porcentaje = (ejerciciosCompletados.length / ejercicios.length) * 100;

        const barraProgreso = document.querySelector('.progreso');
        const textoProgreso = document.querySelector('.leccion-progreso span');

        if (barraProgreso) {
            barraProgreso.style.width = `${porcentaje}%`;
        }

        if (textoProgreso) {
            textoProgreso.textContent = `${Math.round(porcentaje)}% Completado`;
        }

        // Guardar progreso en localStorage
        const leccionActual = window.location.pathname;
        localStorage.setItem(`progreso_${leccionActual}`, porcentaje);
    }

    navegarLeccion(direccion) {
        const leccionActual = window.location.pathname;
        const lecciones = [
            '/contenido/ciencias/leccion1.html',
            '/contenido/ciencias/leccion2.html',
            '/contenido/ciencias/leccion3.html',
            '/contenido/ciencias/leccion4.html',
            '/contenido/ciencias/leccion5.html'
        ];

        const indiceActual = lecciones.indexOf(leccionActual);
        let siguienteIndice;

        if (direccion === 'next') {
            siguienteIndice = indiceActual + 1;
        } else {
            siguienteIndice = indiceActual - 1;
        }

        if (siguienteIndice >= 0 && siguienteIndice < lecciones.length) {
            window.location.href = lecciones[siguienteIndice];
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const leccionManager = new LeccionManager();

    // Agregar estilos de feedback dinámicamente
    const style = document.createElement('style');
    style.textContent = `
        .feedback {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease-out;
            z-index: 1000;
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

        .arrastrando {
            opacity: 0.5;
        }

        .sobre {
            background: rgba(var(--primary-color-rgb), 0.1);
            border: 2px dashed var(--primary-color);
        }

        .parte-planta.seleccionada .punto,
        .parte-flor.seleccionada .punto {
            background: var(--primary-color);
            transform: scale(1.5);
        }

        .ejercicio.completado {
            border-color: #4CAF50;
        }
    `;
    document.head.appendChild(style);
}); 