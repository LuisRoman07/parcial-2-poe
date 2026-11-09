import { Tarea, Prioridad } from './Tarea.js';
import { StorageService } from '../services/StorageService.js';

export type FiltroEstado = 'todas' | 'pendientes' | 'completadas';
export type FiltroPrioridad = 'todas' | Prioridad;
export type Orden = 'ninguno' | 'fecha' | 'prioridad';

export interface DatosTarea {
    titulo: string;
    descripcion: string;
    prioridad: Prioridad;
    fechaLimite: string;
}

const PESO_PRIORIDAD: Record<Prioridad, number> = { alta: 0, media: 1, baja: 2 };

export class TareaModel {
    private tareas: Tarea[];

    constructor() {
        this.tareas = StorageService.obtenerTareas();
    }

    getTareas(): Tarea[] {
        return this.tareas;
    }

    getTarea(id: number): Tarea | undefined {
        return this.tareas.find(t => t.id === id);
    }

    addTarea(datos: DatosTarea): Tarea {
        const t = new Tarea(Date.now(), datos.titulo, datos.descripcion, datos.prioridad, datos.fechaLimite, false);
        this.tareas.push(t);
        this.guardar();
        return t;
    }

    toggleTarea(id: number): void {
        const t = this.getTarea(id);
        if (t) {
            t.completada = !t.completada;
            this.guardar();
        }
    }

    /** RF-03: edita una tarea existente. */
    updateTarea(id: number, datos: DatosTarea): boolean {
        const t = this.getTarea(id);
        if (!t) return false;
        t.titulo = datos.titulo;
        t.descripcion = datos.descripcion;
        t.prioridad = datos.prioridad;
        t.fechaLimite = datos.fechaLimite;
        this.guardar();
        return true;
    }

    /** RF-04: elimina una tarea (la confirmación la pide el controlador). */
    deleteTarea(id: number): boolean {
        const antes = this.tareas.length;
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardar();
        return this.tareas.length < antes;
    }

    /** RF-05: busca por título (sin distinguir mayúsculas). */
    searchTareas(termino: string, base: Tarea[] = this.tareas): Tarea[] {
        const q = termino.trim().toLowerCase();
        return q ? base.filter(t => t.titulo.toLowerCase().includes(q)) : [...base];
    }

    /** RF-06: filtra por estado y prioridad. */
    filterTareas(estado: FiltroEstado, prioridad: FiltroPrioridad, base: Tarea[] = this.tareas): Tarea[] {
        return base.filter(t => {
            const okEstado = estado === 'todas' || (estado === 'pendientes' ? !t.completada : t.completada);
            const okPrioridad = prioridad === 'todas' || t.prioridad === prioridad;
            return okEstado && okPrioridad;
        });
    }

    /** RF-07: ordena por fecha límite o por prioridad (alta → baja). */
    ordenarTareas(orden: Orden, base: Tarea[] = this.tareas): Tarea[] {
        const copia = [...base];
        if (orden === 'fecha') {
            copia.sort((a, b) => (a.fechaLimite || '9999-99-99').localeCompare(b.fechaLimite || '9999-99-99'));
        } else if (orden === 'prioridad') {
            copia.sort((a, b) => PESO_PRIORIDAD[a.prioridad] - PESO_PRIORIDAD[b.prioridad]);
        }
        return copia;
    }

    /** RF-09 */
    contarPendientes(): number {
        return this.tareas.filter(t => !t.completada).length;
    }

    private guardar(): void {
        StorageService.guardarTareas(this.tareas);
    }
}
