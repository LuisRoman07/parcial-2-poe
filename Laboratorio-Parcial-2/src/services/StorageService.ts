import { Tarea } from '../models/Tarea.js';

export class StorageService {
    private static STORAGE_KEY = 'tareas_app';

    /** Recupera las tareas y las reconstruye como instancias de Tarea.
     *  Las tareas guardadas por la versión anterior reciben valores por defecto. */
    static obtenerTareas(): Tarea[] {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            const arr: any[] = data ? JSON.parse(data) : [];
            return arr.map(o => new Tarea(
                o.id,
                o.titulo,
                o.descripcion ?? '',
                ['alta', 'media', 'baja'].includes(o.prioridad) ? o.prioridad : 'media',
                o.fechaLimite ?? '',
                !!o.completada
            ));
        } catch {
            return [];
        }
    }

    static guardarTareas(tareas: Tarea[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tareas));
    }
}
