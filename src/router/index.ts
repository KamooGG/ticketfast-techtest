// Importa las funciones necesarias de vue-router para crear el router y definir el historial
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// Define las rutas de la aplicación como un arreglo de objetos RouteRecordRaw
const routes: RouteRecordRaw[] = [
    // Aquí se agregarán las rutas de la aplicación, cada una representa una vista/componente
];

// Crea la instancia del router usando el historial HTML5 y las rutas definidas
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Exporta el router para que pueda ser usado en la aplicación principal (main.ts)
export default router;
