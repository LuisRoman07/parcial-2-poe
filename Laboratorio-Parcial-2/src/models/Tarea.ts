export type Prioridad = 'alta' | 'media' | 'baja';

export class Tarea {
    constructor(
        public id: number,
        public titulo: string,
        public descripcion: string,
        public prioridad: Prioridad = 'media',
        public fechaLimite: string = '', // formato YYYY-MM-DD
        public completada: boolean = false
    ) {}

    /** Reto: una tarea está vencida si no está completada y su fecha límite ya pasó. */
    estaVencida(): boolean {
        if (this.completada || !this.fechaLimite) return false;
        return this.fechaLimite < Tarea.hoy();
    }

    static hoy(): string {
        const d = new Date();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${mm}-${dd}`;
    }
}
