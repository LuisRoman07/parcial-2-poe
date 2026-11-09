import { Tarea } from '../models/Tarea.js';
export class StorageService {
    /** Recupera las tareas y las reconstruye como instancias de Tarea.
     *  Las tareas guardadas por la versión anterior reciben valores por defecto. */
    static obtenerTareas() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            const arr = data ? JSON.parse(data) : [];
            return arr.map(o => {
                var _a, _b;
                return new Tarea(o.id, o.titulo, (_a = o.descripcion) !== null && _a !== void 0 ? _a : '', ['alta', 'media', 'baja'].includes(o.prioridad) ? o.prioridad : 'media', (_b = o.fechaLimite) !== null && _b !== void 0 ? _b : '', !!o.completada);
            });
        }
        catch (_a) {
            return [];
        }
    }
    static guardarTareas(tareas) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tareas));
    }
}
StorageService.STORAGE_KEY = 'tareas_app';
