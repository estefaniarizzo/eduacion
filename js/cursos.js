class CursosManager {
    constructor() {
        this.init();
    }

    init() {
        this.configurarBusqueda();
        this.configurarFiltros();
        this.configurarAnimaciones();
    }

    configurarBusqueda() {
        const buscarInput = document.getElementById('buscar-curso');
        let timeoutId;

        buscarInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const busqueda = e.target.value.toLowerCase();
                this.filtrarCursos(busqueda);
            }, 300);
        });
    }

    configurarFiltros() {
        const botonesCategorias = document.querySelectorAll('.btn-categoria');
        
        botonesCategorias.forEach(boton => {
            boton.addEventListener('click', () => {
                // Remover clase active de todos los botones
                botonesCategorias.forEach(b => b.classList.remove('active'));
                // Agregar clase active al botón clickeado
                boton.classList.add('active');
                
                const categoria = boton.dataset.categoria;
                this.filtrarPorCategoria(categoria);
            });
        });
    }

    filtrarCursos(busqueda) {
        const cursos = document.querySelectorAll('.curso-card');
        const categoriaActiva = document.querySelector('.btn-categoria.active').dataset.categoria;

        cursos.forEach(curso => {
            const titulo = curso.querySelector('h3').textContent.toLowerCase();
            const descripcion = curso.querySelector('p').textContent.toLowerCase();
            const coincideBusqueda = titulo.includes(busqueda) || descripcion.includes(busqueda);
            const coincideCategoria = categoriaActiva === 'todos' || curso.dataset.categoria === categoriaActiva;

            if (coincideBusqueda && coincideCategoria) {
                curso.style.display = 'block';
                curso.classList.add('aparecer');
            } else {
                curso.style.display = 'none';
                curso.classList.remove('aparecer');
            }
        });
    }

    filtrarPorCategoria(categoria) {
        const cursos = document.querySelectorAll('.curso-card');
        const busqueda = document.getElementById('buscar-curso').value.toLowerCase();

        cursos.forEach(curso => {
            const titulo = curso.querySelector('h3').textContent.toLowerCase();
            const descripcion = curso.querySelector('p').textContent.toLowerCase();
            const coincideBusqueda = titulo.includes(busqueda) || descripcion.includes(busqueda);
            const coincideCategoria = categoria === 'todos' || curso.dataset.categoria === categoria;

            if (coincideBusqueda && coincideCategoria) {
                curso.style.display = 'block';
                curso.classList.add('aparecer');
            } else {
                curso.style.display = 'none';
                curso.classList.remove('aparecer');
            }
        });
    }

    configurarAnimaciones() {
        const cursos = document.querySelectorAll('.curso-card');
        
        const observador = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aparecer');
                }
            });
        }, {
            threshold: 0.1
        });

        cursos.forEach(curso => {
            observador.observe(curso);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const cursosManager = new CursosManager();
}); 