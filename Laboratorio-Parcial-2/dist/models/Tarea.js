export class Tarea {
    constructor(id, titulo, descripcion, prioridad = 'media', fechaLimite = '', // formato YYYY-MM-DD
    completada = false) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.fechaLimite = fechaLimite;
        this.completada = completada;
    }
    /** Reto: una tarea está vencida si no está completada y su fecha límite ya pasó. */
    estaVencida() {
        if (this.completada || !this.fechaLimite)
            return false;
        return this.fechaLimite < Tarea.hoy();
    }
    static hoy() {
        const d = new Date();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${mm}-${dd}`;
    }
}
