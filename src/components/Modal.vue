<template>
    <!--
        Modal Overlay: se muestra solo si 'open' es true.
        Al hacer click fuera del contenido (en el overlay), emite el evento 'close'.
    -->
    <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <!--
                Encabezado del modal: muestra el título y un botón para cerrar.
                El botón de cerrar también emite el evento 'close'.
            -->
            <header class="modal-header">
                <h3>{{ title }}</h3>
                <button class="close-btn" @click="$emit('close')">✖</button>
            </header>
            <!--
                Cuerpo del modal: muestra el contenido insertado mediante slot.
            -->
            <section class="modal-body">
                <slot />
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
// Define las props que recibe el modal: 'open' para mostrar/ocultar y 'title' para el encabezado
defineProps<{ open: boolean; title: string }>();
// Define el evento 'close' que se emite al cerrar el modal
defineEmits<{ (e: "close"): void }>();
</script>

<style scoped>
/* Overlay oscuro que cubre toda la pantalla cuando el modal está abierto */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
}

/* Contenedor principal del modal */
.modal-content {
    background: white;
    border-radius: 12px;
    padding: 16px;
    max-width: 600px;
    width: 100%;
}

/* Encabezado del modal con título y botón de cerrar */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

/* Botón de cerrar (X) */
.close-btn {
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
}
</style>
