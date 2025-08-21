
# TicketFast
TicketFast es una aplicación de ejemplo para la prueba técnica de Tickets. Proporciona una base con Vue 3, TypeScript y Vite para construir una interfaz de gestión de Tickets.

## Objetivos

- Servir como punto de partida para desarrollar funcionalidades del sistema de Tickets.
- Mostrar el uso de Vue 3 con TypeScript y Pinia en un entorno de Vite.

## Instalación

1. Instala las dependencias con:

   ```bash
   npm install
   ```

## Ejecución

- Modo desarrollo:

  ```bash
  npm run dev
  ```

  La aplicación estará disponible en `http://localhost:5173`.

- Compilar para producción:

  ```bash
  npm run build
  ```

- Previsualizar la build:

  ```bash
  npm run preview
  ```

## Decisiones técnicas

- Vue 3 y TypeScript como base del front-end.
- Pinia para la gestión del estado.
- Vite para un entorno de desarrollo rápido
- En el documento decía una manera de manejar en CRUD, en este proyecto se implementó una mejora en la que el detalle, la actualización y la eliminación hacen parte de un menú contextual, que se abre si se da click en la tabla, y la creación, desde un botón, haciendo que se implementara una ventana emergente para la creación del registro y este mismo componente se usaría para el detalle y la actualización con ciertos modificadores, como que en el detalle no se pueda editar la información.

## Tiempo invertido

Los tiempos son aproximados:

| Actividad                                 | Tiempo |
| ----------------------------------------- | ------ |
| Configuración inicial del proyecto        | 1 h    |
| Redacción de documentación                | 0.5 h  |
| Ajustes y verificación manual             | 0.5 h  |
| Maquetación de Layout                     | 2 h    |
| Definición y desarrollo de componentes    | 6 h    |
| Implementación de lógica de la aplicación | 3 h    |
| Revisión e implementación de mejoras      | 3 h    |

## Mejoras futuras

- Añadir pruebas unitarias e integraciones.
- Configurar integración continua.
- Ampliar la documentación y ejemplos de uso.
