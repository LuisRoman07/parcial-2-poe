import { TareaView } from '../views/TareaView.js';
import { TareaModel, FiltroEstado, FiltroPrioridad, Orden } from '../models/TareaModel.js';

export class TareaController {
    private model: TareaModel;
    private view: TareaView;

    // Estado actual de la consulta (búsqueda + filtros + orden)
    private termino = '';
    private estado: FiltroEstado = 'todas';
    private prioridad: FiltroPrioridad = 'todas';
    private orden: Orden = 'ninguno';

    constructor(view: TareaView, model: TareaModel = new TareaModel()) {
        this.view = view;
        this.model = model;
        this.inicializarEventos();
        this.refrescar();
    }

    private inicializarEventos(): void {
        const form = document.getElementById('form-tarea') as HTMLFormElement;
        form.addEventListener('submit', e => {
            e.preventDefault();
            this.agregarTarea();
        });

        const lista = document.getElementById('lista-tareas') as HTMLElement;
        lista.addEventListener('click', e => {
            const target = e.target as HTMLElement;
            const id = Number(target.getAttribute('data-id'));

            if (target.classList.contains('toggle-btn')) {
                this.toggleTarea(id);
            } else if (target.classList.contains('delete-btn')) {
                this.handleDelete(id);
            } else if (target.classList.contains('edit-btn')) {
                this.handleEdit(id);
            } else if (target.classList.contains('cancel-edit-btn')) {
                this.refrescar();
            }
        });

        lista.addEventListener('submit', e => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            if (form.classList.contains('edit-form')) {
                this.handleUpdate(Number(form.getAttribute('data-id')));
            }
        });

        const buscarInput = document.getElementById('buscar') as HTMLInputElement;
        buscarInput.addEventListener('input', () => this.handleSearch(buscarInput.value));

        const filtroEstado = document.getElementById('filtro') as HTMLSelectElement;
        filtroEstado.addEventListener('change', () => this.handleFilter(filtroEstado.value as FiltroEstado, this.prioridad));

        const filtroPrioridad = document.getElementById('filtro-prioridad') as HTMLSelectElement;
        filtroPrioridad.addEventListener('change', () => this.handleFilter(this.estado, filtroPrioridad.value as FiltroPrioridad));

        const ordenSelect = document.getElementById('orden') as HTMLSelectElement;
        ordenSelect.addEventListener('change', () => this.handleSort(ordenSelect.value as Orden));

        // Reto: re-evalúa las tareas vencidas cada minuto (por si cambia el día con la página abierta)
        setInterval(() => this.refrescar(), 60_000);
    }

    /** Aplica búsqueda → filtros → orden y vuelve a pintar vista y contador. */
    private refrescar(): void {
        let resultado = this.model.searchTareas(this.termino);
        resultado = this.model.filterTareas(this.estado, this.prioridad, resultado);
        resultado = this.model.ordenarTareas(this.orden, resultado);
        this.view.renderizar(resultado);
        this.view.renderCounter(this.model.contarPendientes());
    }

    agregarTarea(): void {
        const datos = this.view.obtenerDatosFormulario();
        if (!datos.titulo || !datos.descripcion || !datos.fechaLimite) {
            this.view.mostrarMensaje('Por favor complete todos los campos.');
            return;
        }
        this.model.addTarea(datos);
        this.view.limpiarFormulario();
        this.refrescar();
    }

    toggleTarea(id: number): void {
        this.model.toggleTarea(id);
        this.refrescar();
    }

    handleEdit(id: number): void {
        const tarea = this.model.getTarea(id);
        if (tarea) this.view.renderEditForm(tarea);
    }

    handleUpdate(id: number): void {
        const datos = this.view.obtenerDatosEdicion(id);
        if (!datos) return;
        if (!datos.titulo || !datos.descripcion || !datos.fechaLimite) {
            this.view.mostrarMensaje('Por favor complete todos los campos.');
            return;
        }
        this.model.updateTarea(id, datos);
        this.refrescar();
    }

    handleDelete(id: number): void {
        if (this.view.confirmar('¿Está seguro de eliminar esta tarea?')) {
            this.model.deleteTarea(id);
            this.refrescar();
        }
    }

    handleSearch(termino: string): void {
        this.termino = termino;
        this.refrescar();
    }

    handleFilter(estado: FiltroEstado, prioridad: FiltroPrioridad): void {
        this.estado = estado;
        this.prioridad = prioridad;
        this.refrescar();
    }

    handleSort(orden: Orden): void {
        this.orden = orden;
        this.refrescar();
    }
}
