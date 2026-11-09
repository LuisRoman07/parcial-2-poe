import { Tarea } from './Tarea.js';
import { StorageService } from '../services/StorageService.js';
const PESO_PRIORIDAD = { alta: 0, media: 1, baja: 2 };
export class TareaModel {
    constructor() {
        this.tareas = StorageService.obtenerTareas();
    }
    getTareas() {
        return this.tareas;
    }
    getTarea(id) {
        return this.tareas.find(t => t.id === id);
    }
    addTarea(datos) {
        const t = new Tarea(Date.now(), datos.titulo, datos.descripcion, datos.prioridad, datos.fechaLimite, false);
        this.tareas.push(t);
        this.guardar();
        return t;
    }
    toggleTarea(id) {
        const t = this.getTarea(id);
        if (t) {
            t.completada = !t.completada;
            this.guardar();
        }
    }
    /** RF-03: edita una tarea existente. */
    updateTarea(id, datos) {
        const t = this.getTarea(id);
        if (!t)
            return false;
        t.titulo = datos.titulo;
        t.descripcion = datos.descripcion;
        t.prioridad = datos.prioridad;
        t.fechaLimite = datos.fechaLimite;
        this.guardar();
        return true;
    }
    /** RF-04: elimina una tarea (la confirmación la pide el controlador). */
    deleteTarea(id) {
        const antes = this.tareas.length;
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardar();
        return this.tareas.length < antes;
    }
    /** RF-05: busca por título (sin distinguir mayúsculas). */
    searchTareas(termino, base = this.tareas) {
        const q = termino.trim().toLowerCase();
        return q ? base.filter(t => t.titulo.toLowerCase().includes(q)) : [...base];
    }
    /** RF-06: filtra por estado y prioridad. */
    filterTareas(estado, prioridad, base = this.tareas) {
        return base.filter(t => {
            const okEstado = estado === 'todas' || (estado === 'pendientes' ? !t.completada : t.completada);
            const okPrioridad = prioridad === 'todas' || t.prioridad === prioridad;
            return okEstado && okPrioridad;
        });
    }
    /** RF-07: ordena por fecha límite o por prioridad (alta → baja). */
    ordenarTareas(orden, base = this.tareas) {
        const copia = [...base];
        if (orden === 'fecha') {
            copia.sort((a, b) => (a.fechaLimite || '9999-99-99').localeCompare(b.fechaLimite || '9999-99-99'));
        }
        else if (orden === 'prioridad') {
            copia.sort((a, b) => PESO_PRIORIDAD[a.prioridad] - PESO_PRIORIDAD[b.prioridad]);
        }
        return copia;
    }
    /** RF-09 */
    contarPendientes() {
        return this.tareas.filter(t => !t.completada).length;
    }
    guardar() {
        StorageService.guardarTareas(this.tareas);
    }
}
