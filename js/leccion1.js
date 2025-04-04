class Leccion1Manager {
    constructor() {
        this.numeros = [
            { valor: 1, texto: "uno" },
            { valor: 2, texto: "dos" },
            { valor: 3, texto: "tres" },
            { valor: 4, texto: "cuatro" },
            { valor: 5, texto: "cinco" },
            { valor: 6, texto: "seis" },
            { valor: 7, texto: "siete" },
            { valor: 8, texto: "ocho" },
            { valor: 9, texto: "nueve" },
            { valor: 10, texto: "diez" }
        ];
        this.ejercicio1Actual = null;
        this.numerosDesordenados = [...this.numeros].sort(() => Math.random() - 0.5);
        this.init();
    }

    init() {
        this.cargarNumeros();
        this.iniciarEjercicio1();
        this.iniciarEjercicio2();
        this.configurarNavegacion();
    }

    cargarNumeros() {
        const numerosGrid = document.querySelector('.numeros-grid');
        if (!numerosGrid) return;

        numerosGrid.innerHTML = this.numeros.map(numero => `
            <div class="numero-card" data-valor="${numero.valor}">
                <div class="numero-valor">${numero.valor}</div>
                <div class="numero-texto">${numero.texto}</div>
            </div>
        `).join('');

        // Agregar interactividad a las tarjetas
        numerosGrid.querySelectorAll('.numero-card').forEach(card => {
            card.addEventListener('click', () => {
                const valor = parseInt(card.dataset.valor);
                this.reproducirAudio(valor);
                this.celebrarNumero(card);
            });
        });
    }

    reproducirAudio(numero) {
        // Aquí se implementaría la reproducción del audio del número
        console.log(`Reproduciendo audio del número ${numero}`);
    }

    celebrarNumero(card) {
        card.classList.add('celebrating');
        setTimeout(() => card.classList.remove('celebrating'), 500);
    }

    iniciarEjercicio1() {
        this.ejercicio1Actual = this.obtenerNumeroAleatorio();
        const numeroDisplay = document.querySelector('.numero-display');
        const opcionesContainer = document.querySelector('.opciones');
        
        if (!numeroDisplay || !opcionesContainer) return;

        // Mostrar el número
        numeroDisplay.textContent = this.ejercicio1Actual.texto;

        // Generar opciones
        const opciones = this.generarOpciones(this.ejercicio1Actual.valor);
        opcionesContainer.innerHTML = opciones.map(opcion => `
            <div class="opcion" data-valor="${opcion}">${opcion}</div>
        `).join('');

        // Agregar event listeners a las opciones
        opcionesContainer.querySelectorAll('.opcion').forEach(opcion => {
            opcion.addEventListener('click', () => {
                const valorSeleccionado = parseInt(opcion.dataset.valor);
                this.verificarRespuesta(valorSeleccionado, this.ejercicio1Actual.valor, 1);
            });
        });
    }

    obtenerNumeroAleatorio() {
        return this.numeros[Math.floor(Math.random() * this.numeros.length)];
    }

    generarOpciones(respuestaCorrecta) {
        const opciones = [respuestaCorrecta];
        while (opciones.length < 4) {
            const opcion = Math.floor(Math.random() * 10) + 1;
            if (!opciones.includes(opcion)) {
                opciones.push(opcion);
            }
        }
        return opciones.sort(() => Math.random() - 0.5);
    }

    verificarRespuesta(seleccionada, correcta, ejercicioNum) {
        const feedback = document.querySelectorAll('.feedback')[ejercicioNum - 1];
        const opcionSeleccionada = document.querySelector(`.opcion[data-valor="${seleccionada}"]`);
        
        if (seleccionada === correcta) {
            feedback.textContent = "¡Correcto! ¡Muy bien!";
            feedback.className = "feedback success";
            opcionSeleccionada.classList.add('correct');
            setTimeout(() => this.iniciarEjercicio1(), 1500);
        } else {
            feedback.textContent = "¡Inténtalo de nuevo!";
            feedback.className = "feedback error";
            opcionSeleccionada.classList.add('incorrect');
            setTimeout(() => {
                opcionSeleccionada.classList.remove('incorrect');
                feedback.className = "feedback";
            }, 1500);
        }
    }

    iniciarEjercicio2() {
        const contenedorDesordenados = document.querySelector('.numeros-desordenados');
        const contenedorOrdenados = document.querySelector('.numeros-ordenados');
        
        if (!contenedorDesordenados || !contenedorOrdenados) return;

        // Crear números arrastrables
        contenedorDesordenados.innerHTML = this.numerosDesordenados.map(numero => `
            <div class="numero-arrastrable" draggable="true" data-valor="${numero.valor}">
                ${numero.valor}
            </div>
        `).join('');

        // Configurar drag and drop
        this.configurarDragAndDrop();
    }

    configurarDragAndDrop() {
        const numerosArrastrables = document.querySelectorAll('.numero-arrastrable');
        const contenedorOrdenados = document.querySelector('.numeros-ordenados');
        const contenedorDesordenados = document.querySelector('.numeros-desordenados');

        numerosArrastrables.forEach(numero => {
            numero.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.valor);
                numero.classList.add('dragging');
            });

            numero.addEventListener('dragend', () => {
                numero.classList.remove('dragging');
            });
        });

        [contenedorOrdenados, contenedorDesordenados].forEach(contenedor => {
            contenedor.addEventListener('dragover', (e) => {
                e.preventDefault();
                contenedor.classList.add('dragover');
            });

            contenedor.addEventListener('dragleave', () => {
                contenedor.classList.remove('dragover');
            });

            contenedor.addEventListener('drop', (e) => {
                e.preventDefault();
                contenedor.classList.remove('dragover');
                const valor = e.dataTransfer.getData('text/plain');
                const numeroArrastrado = document.querySelector(`.numero-arrastrable[data-valor="${valor}"]`);
                
                if (numeroArrastrado) {
                    contenedor.appendChild(numeroArrastrado);
                    this.verificarOrden();
                }
            });
        });
    }

    verificarOrden() {
        const contenedorOrdenados = document.querySelector('.numeros-ordenados');
        const numerosOrdenados = Array.from(contenedorOrdenados.children).map(n => parseInt(n.dataset.valor));
        const feedback = document.querySelectorAll('.feedback')[1];

        if (numerosOrdenados.length === this.numeros.length) {
            const ordenCorrecto = numerosOrdenados.every((num, index) => num === index + 1);
            
            if (ordenCorrecto) {
                feedback.textContent = "¡Excelente! ¡Has ordenado todos los números correctamente!";
                feedback.className = "feedback success";
                this.celebrarLogro();
            } else {
                feedback.textContent = "¡Casi! Revisa el orden de los números.";
                feedback.className = "feedback error";
            }
        }
    }

    celebrarLogro() {
        // Aquí se implementaría la celebración del logro
        console.log("¡Logro conseguido!");
    }

    configurarNavegacion() {
        const siguienteBtn = document.getElementById('siguiente-btn');
        if (siguienteBtn) {
            siguienteBtn.addEventListener('click', () => {
                window.location.href = 'leccion2.html';
            });
        }
    }
}

// Inicializar la lección cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const leccion1 = new Leccion1Manager();
}); 