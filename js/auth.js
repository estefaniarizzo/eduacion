class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        const registroForm = document.getElementById('registro-form');
        const loginForm = document.getElementById('login-form');

        if (registroForm) {
            this.configurarRegistro();
        }

        if (loginForm) {
            this.configurarLogin();
        }

        // Verificar estado de autenticación en todas las páginas
        this.verificarAutenticacion();
    }

    verificarAutenticacion() {
        const rutasProtegidas = ['/cursos.html', '/perfil.html', '/contenido/'];
        const rutaActual = window.location.pathname;
        
        // Verificar si la ruta actual requiere autenticación
        const requiereAutenticacion = rutasProtegidas.some(ruta => rutaActual.includes(ruta));
        
        if (requiereAutenticacion && !AuthManager.isLoggedIn()) {
            window.location.href = '/login.html';
            return;
        }

        // Actualizar UI según el estado de autenticación
        this.actualizarUI();
    }

    actualizarUI() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const authSection = navbar.querySelector('.auth-section');
        const userMenu = navbar.querySelector('.user-menu');

        if (AuthManager.isLoggedIn()) {
            const user = AuthManager.getCurrentUser();
            if (authSection) authSection.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                const userName = userMenu.querySelector('.user-name');
                if (userName) userName.textContent = user.nombre;
            }
        } else {
            if (authSection) authSection.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    configurarRegistro() {
        const form = document.getElementById('registro-form');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const strengthProgress = document.querySelector('.strength-progress');
        const strengthText = document.querySelector('.strength-text');

        // Validar fuerza de la contraseña
        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = this.evaluarFuerzaContraseña(password);
            this.actualizarIndicadorFuerza(strength, strengthProgress, strengthText);
        });

        // Manejar envío del formulario
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validar contraseñas
            if (passwordInput.value !== confirmPasswordInput.value) {
                this.mostrarError('Las contraseñas no coinciden');
                return;
            }

            // Validar fuerza de la contraseña
            const strength = this.evaluarFuerzaContraseña(passwordInput.value);
            if (strength.score < 2) {
                this.mostrarError('La contraseña es demasiado débil');
                return;
            }

            // Recopilar datos del formulario
            const formData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                password: passwordInput.value,
                grado: document.getElementById('grado').value,
                fechaRegistro: new Date().toISOString()
            };

            try {
                // Verificar si el email ya existe
                const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
                if (usuarios.some(user => user.email === formData.email)) {
                    throw new Error('El correo electrónico ya está registrado');
                }

                // Agregar nuevo usuario
                usuarios.push(formData);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                // Guardar sesión
                this.establecerSesion(formData);
                
                // Redirigir al dashboard
                window.location.href = '/cursos.html';
            } catch (error) {
                this.mostrarError(error.message);
            }
        });
    }

    configurarLogin() {
        const form = document.getElementById('login-form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const recordar = document.getElementById('recordar').checked;

            try {
                // Obtener usuarios registrados
                const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
                
                // Buscar usuario
                const usuario = usuarios.find(user => 
                    user.email === email && user.password === password
                );

                if (!usuario) {
                    throw new Error('Credenciales incorrectas');
                }

                // Guardar sesión
                this.establecerSesion(usuario, recordar);

                // Redirigir al dashboard
                window.location.href = '/cursos.html';
            } catch (error) {
                this.mostrarError(error.message);
            }
        });
    }

    establecerSesion(usuario, recordar = false) {
        const storage = recordar ? localStorage : sessionStorage;
        storage.setItem('userToken', 'token_' + Date.now());
        storage.setItem('userName', usuario.nombre);
        storage.setItem('userEmail', usuario.email);
        storage.setItem('userGrado', usuario.grado);
    }

    evaluarFuerzaContraseña(password) {
        let score = 0;
        let feedback = '';

        // Longitud mínima
        if (password.length >= 8) {
            score++;
        }

        // Contiene números
        if (/\d/.test(password)) {
            score++;
        }

        // Contiene letras minúsculas y mayúsculas
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
            score++;
        }

        // Contiene caracteres especiales
        if (/[!@#$%^&*]/.test(password)) {
            score++;
        }

        // Determinar mensaje de feedback
        if (score < 2) {
            feedback = 'Débil';
        } else if (score < 3) {
            feedback = 'Media';
        } else {
            feedback = 'Fuerte';
        }

        return { score, feedback };
    }

    actualizarIndicadorFuerza(strength, progressBar, textElement) {
        // Remover clases anteriores
        progressBar.classList.remove('weak', 'medium', 'strong');

        // Agregar clase según la fuerza
        if (strength.score < 2) {
            progressBar.classList.add('weak');
        } else if (strength.score < 3) {
            progressBar.classList.add('medium');
        } else {
            progressBar.classList.add('strong');
        }

        // Actualizar texto
        textElement.textContent = `Fuerza: ${strength.feedback}`;
    }

    mostrarError(mensaje) {
        // Crear elemento de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = mensaje;

        // Insertar después del formulario
        const form = document.querySelector('.auth-form');
        form.parentNode.insertBefore(errorDiv, form.nextSibling);

        // Remover después de 3 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Utilidades
    static isLoggedIn() {
        return !!(localStorage.getItem('userToken') || sessionStorage.getItem('userToken'));
    }

    static logout() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userGrado');
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userGrado');
        window.location.href = 'login.html';
    }

    static getCurrentUser() {
        return {
            nombre: localStorage.getItem('userName') || sessionStorage.getItem('userName'),
            email: localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail'),
            grado: localStorage.getItem('userGrado') || sessionStorage.getItem('userGrado')
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();

    // Agregar estilos de error dinámicamente
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            background: #ffebee;
            color: #c62828;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
            text-align: center;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}); 