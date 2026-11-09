import { TareaModel } from '../models/TareaModel.js';
export class TareaController {
    constructor(view, model = new TareaModel()) {
        // Estado actual de la consulta (búsqueda + filtros + orden)
        this.termino = '';
        this.estado = 'todas';
        this.prioridad = 'todas';
        this.orden = 'ninguno';
        this.view = view;
        this.model = model;
        this.inicializarEventos();
        this.refrescar();
    }
    inicializarEventos() {
        const form = document.getElementById('form-tarea');
        form.addEventListener('submit', e => {
            e.preventDefault();
            this.agregarTarea();
        });
        const lista = document.getElementById('lista-tareas');
        lista.addEventListener('click', e => {
            const target = e.target;
            const id = Number(target.getAttribute('data-id'));
            if (target.classList.contains('toggle-btn')) {
                this.toggleTarea(id);
            }
            else if (target.classList.contains('delete-btn')) {
                this.handleDelete(id);
            }
            else if (target.classList.contains('edit-btn')) {
                this.handleEdit(id);
            }
            else if (target.classList.contains('cancel-edit-btn')) {
                this.refrescar();
            }
        });
        lista.addEventListener('submit', e => {
            e.preventDefault();
            const form = e.target;
            if (form.classList.contains('edit-form')) {
                this.handleUpdate(Number(form.getAttribute('data-id')));
            }
        });
        const buscarInput = document.getElementById('buscar');
        buscarInput.addEventListener('input', () => this.handleSearch(buscarInput.value));
        const filtroEstado = document.getElementById('filtro');
        filtroEstado.addEventListener('change', () => this.handleFilter(filtroEstado.value, this.prioridad));
        const filtroPrioridad = document.getElementById('filtro-prioridad');
        filtroPrioridad.addEventListener('change', () => this.handleFilter(this.estado, filtroPrioridad.value));
        const ordenSelect = document.getElementById('orden');
        ordenSelect.addEventListener('change', () => this.handleSort(ordenSelect.value));
        // Reto: re-evalúa las tareas vencidas cada minuto (por si cambia el día con la página abierta)
        setInterval(() => this.refrescar(), 60000);
    }
    /** Aplica búsqueda → filtros → orden y vuelve a pintar vista y contador. */
    refrescar() {
        let resultado = this.model.searchTareas(this.termino);
        resultado = this.model.filterTareas(this.estado, this.prioridad, resultado);
        resultado = this.model.ordenarTareas(this.orden, resultado);
        this.view.renderizar(resultado);
        this.view.renderCounter(this.model.contarPendientes());
    }
    agregarTarea() {
        const datos = this.view.obtenerDatosFormulario();
        if (!datos.titulo || !datos.descripcion || !datos.fechaLimite) {
            this.view.mostrarMensaje('Por favor complete todos los campos.');
            return;
        }
        this.model.addTarea(datos);
        this.view.limpiarFormulario();
        this.refrescar();
    }
    toggleTarea(id) {
        this.model.toggleTarea(id);
        this.refrescar();
    }
    handleEdit(id) {
        const tarea = this.model.getTarea(id);
        if (tarea)
            this.view.renderEditForm(tarea);
    }
    handleUpdate(id) {
        const datos = this.view.obtenerDatosEdicion(id);
        if (!datos)
            return;
        if (!datos.titulo || !datos.descripcion || !datos.fechaLimite) {
            this.view.mostrarMensaje('Por favor complete todos los campos.');
            return;
        }
        this.model.updateTarea(id, datos);
        this.refrescar();
    }
    handleDelete(id) {
        if (this.view.confirmar('¿Está seguro de eliminar esta tarea?')) {
            this.model.deleteTarea(id);
            this.refrescar();
        }
    }
    handleSearch(termino) {
        this.termino = termino;
        this.refrescar();
    }
    handleFilter(estado, prioridad) {
        this.estado = estado;
        this.prioridad = prioridad;
        this.refrescar();
    }
    handleSort(orden) {
        this.orden = orden;
        this.refrescar();
    }
}
