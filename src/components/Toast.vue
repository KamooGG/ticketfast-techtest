<template>
    <!--
        Componente Toast: muestra un mensaje flotante en la esquina inferior derecha.
        El mensaje aparece/desaparece con una transición fade cuando 'show' es true.
    -->
    <transition name="fade">
        <div v-if="show" class="toast">{{ message }}</div>
    </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Estado reactivo para mostrar u ocultar el toast
const show = ref(false);
// Mensaje a mostrar en el toast
const message = ref("");

// Función para abrir el toast con un mensaje y duración opcional
function open(msg: string, ms = 2200) {
    message.value = msg;    // Establece el mensaje
    show.value = true;      // Muestra el toast
    // Oculta el toast después de 'ms' milisegundos
    window.setTimeout(() => (show.value = false), ms);
}

// Expone la función 'open' para que el componente padre pueda mostrar el toast
defineExpose({ open });
</script>

<style scoped>
/* Estilos del toast: posición fija, fondo oscuro, esquinas redondeadas */
.toast {
    position: fixed;
    right: 16px;
    bottom: 16px;
    background: #111827;
    color: #fff;
    padding: 10px 14px;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    z-index: 9999;
}

/* Transición fade para la aparición/desaparición del toast */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
