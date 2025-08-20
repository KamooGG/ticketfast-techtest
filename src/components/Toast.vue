<template>
    <transition name="fade">
        <div v-if="show" class="toast">{{ message }}</div>
    </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

const show = ref(false);
const message = ref("");

function open(msg: string, ms = 2200) {
    message.value = msg;
    show.value = true;
    window.setTimeout(() => (show.value = false), ms);
}

defineExpose({ open });
</script>

<style scoped>
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
