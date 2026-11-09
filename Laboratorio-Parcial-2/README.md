# Gestor de Tareas Personales (Proyecto 1 - Actualización)

Aplicación web con **TypeScript** y arquitectura **MVC** para gestionar tareas con persistencia en `localStorage`.

## Funcionalidades
- Registro y listado de tareas (completada / pendiente)
- RF-01 Fecha límite · RF-02 Prioridad (alta/media/baja)
- RF-03 Editar · RF-04 Eliminar con confirmación
- RF-05 Buscar por título · RF-06 Filtrar por estado y prioridad
- RF-07 Ordenar por fecha o prioridad · RF-08 Persistencia en localStorage
- RF-09 Contador de tareas pendientes
- Reto: tareas vencidas marcadas automáticamente en rojo

## Estructura
- `src/models/Tarea.ts`, `src/models/TareaModel.ts`
- `src/views/TareaView.ts`
- `src/controllers/TareaController.ts`
- `src/services/StorageService.ts`

## Ejecución
```bash
npm install
npm run build
```
Luego abrir `index.html` con un servidor local (por ejemplo la extensión Live Server de VS Code), ya que usa módulos ES.
