import { TareaView } from './views/TareaView.js';
import { TareaController } from './controllers/TareaController.js';
document.addEventListener('DOMContentLoaded', () => {
    const view = new TareaView();
    new TareaController(view);
});
