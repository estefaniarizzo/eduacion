class Leccion2Manager {
    constructor() {
        this.objetos = [
            { nombre: 'manzana', imagen: 'https://cdn-icons-png.flaticon.com/512/415/415682.png' },
            { nombre: 'estrella', imagen: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' },
            { nombre: 'corazon', imagen: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' }
        ];
        this.ejercicio1Actual = null;
        this.ejercicio2Actual = null;
        this.ejercicio3Actual = null;
        this.temporizador = null;
        this.tiempoRestante = 30;
        this.puntuacion = 0;
        this.init();
    }

    init() {
        this.iniciarEjercicio1();
        this.iniciarEjercicio2();
        this.iniciarEjercicio3();
        this.configurarNavegacion();
    }

    // Ejercicio 1: Suma con objetos
    iniciarEjercicio1() {
        const num1 = Math.floor(Math.random() * 5) + 1;
        const num2 = Math.floor(Math.random() * (6 - num1)) + 1;
        this.ejercicio1Actual = { num1, num2, resultado: num1 + num2 };

        const objetosSumaContainer = document.querySelector('.objetos-suma');
        const objetoAleatorio = this.objetos[Math.floor(Math.random() * this.objetos.length)];

        // Mostrar primer grupo de objetos
        const grupo1 = document.createElement('div');
        grupo1.className = 'grupo-objetos';
        for (let i = 0; i < num1; i++) {
            const img = document.createElement('img');
            img.src = objetoAleatorio.imagen;
            img.alt = objetoAleatorio.nombre;
            img.className = 'objeto-animado';
            img.style.width = '40px';
            img.style.height = '40px';
            grupo1.appendChild(img);
        }

        // Mostrar operador
        const operador = document.createElement('div');
        operador.className = 'operador';
        operador.textContent = '+';

        // Mostrar segundo grupo de objetos
        const grupo2 = document.createElement('div');
        grupo2.className = 'grupo-objetos';
        for (let i = 0; i < num2; i++) {
            const img = document.createElement('img');
            img.src = objetoAleatorio.imagen;
            img.alt = objetoAleatorio.nombre;
            img.className = 'objeto-animado';
            img.style.width = '40px';
            img.style.height = '40px';
            grupo2.appendChild(img);
        }

        objetosSumaContainer.innerHTML = '';
        objetosSumaContainer.appendChild(grupo1);
        objetosSumaContainer.appendChild(operador);
        objetosSumaContainer.appendChild(grupo2);

        // Actualizar números en la suma
        document.querySelector('.suma-input .numero1').textContent = num1;
        document.querySelector('.suma-input .numero2').textContent = num2;

        // Configurar verificación
        const verificarBtn = document.querySelector('.verificar-btn');
        const resultadoInput = document.querySelector('.resultado-input');
        
        verificarBtn.onclick = () => {
            const respuesta = parseInt(resultadoInput.value);
            this.verificarRespuesta1(respuesta);
        };

        resultadoInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                const respuesta = parseInt(resultadoInput.value);
                this.verificarRespuesta1(respuesta);
            }
        };
    }

    verificarRespuesta1(respuesta) {
        const feedback = document.querySelectorAll('.feedback')[0];
        
        if (respuesta === this.ejercicio1Actual.resultado) {
            feedback.textContent = "¡Correcto! ¡Muy bien!";
            feedback.className = "feedback success";
            setTimeout(() => {
                this.iniciarEjercicio1();
                document.querySelector('.resultado-input').value = '';
                feedback.className = "feedback";
            }, 1500);
        } else {
            feedback.textContent = "¡Inténtalo de nuevo!";
            feedback.className = "feedback error";
            setTimeout(() => {
                feedback.className = "feedback";
            }, 1500);
        }
    }

    // Ejercicio 2: Encuentra el número faltante
    iniciarEjercicio2() {
        const posicionFaltante = Math.floor(Math.random() * 3); // 0: primer número, 1: segundo número, 2: resultado
        const num1 = Math.floor(Math.random() * 5) + 1;
        const num2 = Math.floor(Math.random() * (6 - num1)) + 1;
        const resultado = num1 + num2;

        this.ejercicio2Actual = {
            num1,
            num2,
            resultado,
            posicionFaltante,
            numeroFaltante: posicionFaltante === 2 ? resultado : (posicionFaltante === 1 ? num2 : num1)
        };

        const sumaIncompletaContainer = document.querySelector('.suma-incompleta');
        sumaIncompletaContainer.innerHTML = `
            <span>${posicionFaltante === 0 ? '?' : num1}</span>
            <span>+</span>
            <span>${posicionFaltante === 1 ? '?' : num2}</span>
            <span>=</span>
            <span>${posicionFaltante === 2 ? '?' : resultado}</span>
        `;

        // Generar opciones
        const opciones = this.generarOpciones(this.ejercicio2Actual.numeroFaltante);
        const opcionesContainer = document.querySelector('.ejercicio:nth-child(2) .opciones');
        opcionesContainer.innerHTML = opciones.map(opcion => `
            <div class="opcion" data-valor="${opcion}">${opcion}</div>
        `).join('');

        // Agregar event listeners a las opciones
        opcionesContainer.querySelectorAll('.opcion').forEach(opcion => {
            opcion.addEventListener('click', () => {
                const valorSeleccionado = parseInt(opcion.dataset.valor);
                this.verificarRespuesta2(valorSeleccionado);
            });
        });
    }

    verificarRespuesta2(respuesta) {
        const feedback = document.querySelectorAll('.feedback')[1];
        const opcionSeleccionada = document.querySelector(`.opcion[data-valor="${respuesta}"]`);
        
        if (respuesta === this.ejercicio2Actual.numeroFaltante) {
            feedback.textContent = "¡Correcto! ¡Muy bien!";
            feedback.className = "feedback success";
            opcionSeleccionada.classList.add('correct');
            setTimeout(() => {
                this.iniciarEjercicio2();
                feedback.className = "feedback";
            }, 1500);
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

    // Ejercicio 3: Suma rápida
    iniciarEjercicio3() {
        if (this.temporizador) {
            clearInterval(this.temporizador);
        }

        this.tiempoRestante = 30;
        this.puntuacion = 0;
        document.querySelector('.puntuacion span').textContent = this.puntuacion;
        
        this.generarNuevaSumaRapida();
        this.iniciarTemporizador();
    }

    generarNuevaSumaRapida() {
        const num1 = Math.floor(Math.random() * 5) + 1;
        const num2 = Math.floor(Math.random() * (6 - num1)) + 1;
        const resultado = num1 + num2;

        this.ejercicio3Actual = { num1, num2, resultado };

        // Actualizar display
        document.querySelector('.suma-rapida .numero1').textContent = num1;
        document.querySelector('.suma-rapida .numero2').textContent = num2;

        // Generar opciones
        const opciones = this.generarOpciones(resultado);
        const opcionesContainer = document.querySelector('.opciones-rapidas');
        opcionesContainer.innerHTML = opciones.map(opcion => `
            <div class="opcion-rapida" data-valor="${opcion}">${opcion}</div>
        `).join('');

        // Agregar event listeners
        opcionesContainer.querySelectorAll('.opcion-rapida').forEach(opcion => {
            opcion.addEventListener('click', () => {
                const valorSeleccionado = parseInt(opcion.dataset.valor);
                this.verificarRespuesta3(valorSeleccionado);
            });
        });
    }

    verificarRespuesta3(respuesta) {
        const feedback = document.querySelectorAll('.feedback')[2];
        
        if (respuesta === this.ejercicio3Actual.resultado) {
            this.puntuacion += 10;
            document.querySelector('.puntuacion span').textContent = this.puntuacion;
            feedback.textContent = "¡Correcto!";
            feedback.className = "feedback success";
            setTimeout(() => {
                feedback.className = "feedback";
                this.generarNuevaSumaRapida();
            }, 500);
        } else {
            feedback.textContent = "¡Incorrecto!";
            feedback.className = "feedback error";
            setTimeout(() => {
                feedback.className = "feedback";
            }, 500);
        }
    }

    iniciarTemporizador() {
        const temporizadorElement = document.querySelector('.temporizador');
        
        this.temporizador = setInterval(() => {
            this.tiempoRestante--;
            temporizadorElement.textContent = this.tiempoRestante;

            if (this.tiempoRestante <= 10) {
                temporizadorElement.classList.add('urgente');
            }

            if (this.tiempoRestante <= 0) {
                clearInterval(this.temporizador);
                this.finalizarEjercicio3();
            }
        }, 1000);
    }

    finalizarEjercicio3() {
        const feedback = document.querySelectorAll('.feedback')[2];
        feedback.textContent = `¡Juego terminado! Puntuación final: ${this.puntuacion}`;
        feedback.className = "feedback success";

        // Deshabilitar opciones
        document.querySelectorAll('.opcion-rapida').forEach(opcion => {
            opcion.style.pointerEvents = 'none';
            opcion.style.opacity = '0.5';
        });

        // Agregar botón para reiniciar
        const reiniciarBtn = document.createElement('button');
        reiniciarBtn.className = 'btn primary';
        reiniciarBtn.textContent = 'Jugar de nuevo';
        reiniciarBtn.onclick = () => this.iniciarEjercicio3();
        feedback.appendChild(reiniciarBtn);
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

    configurarNavegacion() {
        window.onbeforeunload = () => {
            if (this.temporizador) {
                clearInterval(this.temporizador);
            }
        };
    }
}

// Inicializar la lección cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const leccion2 = new Leccion2Manager();
}); 