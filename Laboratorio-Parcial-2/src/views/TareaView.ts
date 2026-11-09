import { Tarea, Prioridad } from '../models/Tarea.js';
import { DatosTarea } from '../models/TareaModel.js';

const ETIQUETA_PRIORIDAD: Record<Prioridad, string> = { alta: 'Alta', media: 'Media', baja: 'Baja' };

function esc(s: string): string {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

export class TareaView {
    private listaElement: HTMLElement;
    private formElement: HTMLFormElement;
    private inputTitulo: HTMLInputElement;
    private inputDescripcion: HTMLTextAreaElement;
    private inputPrioridad: HTMLSelectElement;
    private inputFecha: HTMLInputElement;
    private contadorElement: HTMLElement;

    constructor() {
        this.listaElement = document.getElementById('lista-tareas') as HTMLElement;
        this.formElement = document.getElementById('form-tarea') as HTMLFormElement;
        this.inputTitulo = document.getElementById('titulo') as HTMLInputElement;
        this.inputDescripcion = document.getElementById('descripcion') as HTMLTextAreaElement;
        this.inputPrioridad = document.getElementById('prioridad') as HTMLSelectElement;
        this.inputFecha = document.getElementById('fecha-limite') as HTMLInputElement;
        this.contadorElement = document.getElementById('contador') as HTMLElement;
    }

    renderizar(tareas: Tarea[]): void {
        this.listaElement.innerHTML = '';

        if (tareas.length === 0) {
            this.listaElement.innerHTML = `
                <div class="card p-4 text-center text-muted">
                    <p class="mb-0">No hay tareas para mostrar.</p>
                </div>`;
            return;
        }

        tareas.forEach(tarea => {
            const vencida = tarea.estaVencida();
            const item = document.createElement('div');
            item.id = `tarea-${tarea.id}`;
            item.className = `card mb-3 p-3 ${tarea.completada ? 'bg-light border-0' : ''} ${vencida ? 'tarea-vencida' : ''}`;
            item.innerHTML = `
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h5 class="${tarea.completada ? 'text-decoration-line-through text-muted' : ''}">${esc(tarea.titulo)}</h5>
                        <p class="mb-2 text-muted small">${esc(tarea.descripcion)}</p>
                        <div class="d-flex flex-wrap gap-2 align-items-center">
                            <span class="badge-status ${tarea.completada ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}">
                                ${tarea.completada ? '✓ Completada' : '⏳ Pendiente'}
                            </span>
                            <span class="badge-prioridad prioridad-${tarea.prioridad}">Prioridad ${ETIQUETA_PRIORIDAD[tarea.prioridad]}</span>
                            <span class="fecha-limite small">📅 ${esc(tarea.fechaLimite || 'Sin fecha')}</span>
                            ${vencida ? '<span class="badge-vencida">⚠ VENCIDA</span>' : ''}
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm ${tarea.completada ? 'btn-outline-secondary' : 'btn-outline-success'} toggle-btn" data-id="${tarea.id}">
                            ${tarea.completada ? 'Marcar pendiente' : 'Completar'}
                        </button>
                        <button class="btn btn-sm btn-outline-info edit-btn" data-id="${tarea.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${tarea.id}">Eliminar</button>
                    </div>
                </div>
            `;
            this.listaElement.appendChild(item);
        });
    }

    renderEditForm(tarea: Tarea): void {
        const card = document.getElementById(`tarea-${tarea.id}`);
        if (!card) return;
        card.classList.remove('tarea-vencida');
        card.innerHTML = `
            <form class="edit-form" data-id="${tarea.id}">
                <div class="mb-2">
                    <label class="form-label">Título</label>
                    <input type="text" class="form-control edit-titulo" value="${esc(tarea.titulo)}" required>
                </div>
                <div class="mb-2">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control edit-descripcion" rows="2" required>${esc(tarea.descripcion)}</textarea>
                </div>
                <div class="row g-2 mb-3">
                    <div class="col-sm-6">
                        <label class="form-label">Prioridad</label>
                        <select class="form-select edit-prioridad">
                            ${(['alta', 'media', 'baja'] as Prioridad[]).map(p =>
                                `<option value="${p}" ${p === tarea.prioridad ? 'selected' : ''}>${ETIQUETA_PRIORIDAD[p]}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-sm-6">
                        <label class="form-label">Fecha límite</label>
                        <input type="date" class="form-control edit-fecha" value="${esc(tarea.fechaLimite)}" required>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-sm btn-primary save-edit-btn">Guardar cambios</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary cancel-edit-btn">Cancelar</button>
                </div>
            </form>
        `;
    }

    obtenerDatosEdicion(id: number): DatosTarea | null {
        const form = this.listaElement.querySelector(`.edit-form[data-id="${id}"]`);
        if (!form) return null;
        return {
            titulo: (form.querySelector('.edit-titulo') as HTMLInputElement).value.trim(),
            descripcion: (form.querySelector('.edit-descripcion') as HTMLTextAreaElement).value.trim(),
            prioridad: (form.querySelector('.edit-prioridad') as HTMLSelectElement).value as Prioridad,
            fechaLimite: (form.querySelector('.edit-fecha') as HTMLInputElement).value
        };
    }

    renderCounter(pendientes: number): void {
        this.contadorElement.textContent =
            pendientes === 1 ? '1 tarea pendiente' : `${pendientes} tareas pendientes`;
    }

    obtenerDatosFormulario(): DatosTarea {
        return {
            titulo: this.inputTitulo.value.trim(),
            descripcion: this.inputDescripcion.value.trim(),
            prioridad: this.inputPrioridad.value as Prioridad,
            fechaLimite: this.inputFecha.value
        };
    }

    limpiarFormulario(): void {
        this.formElement.reset();
        this.inputPrioridad.value = 'media';
    }

    mostrarMensaje(mensaje: string): void {
        alert(mensaje);
    }

    confirmar(mensaje: string): boolean {
        return confirm(mensaje);
    }
}
