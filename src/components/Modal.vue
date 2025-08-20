<template>
    <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <header class="modal-header">
                <h3>{{ title }}</h3>
                <button class="close-btn" @click="$emit('close')">✖</button>
            </header>
            <section class="modal-body">
                <slot />
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ open: boolean; title: string }>();
defineEmits<{ (e: "close"): void }>();
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
}

.modal-content {
    background: white;
    border-radius: 12px;
    padding: 16px;
    max-width: 600px;
    width: 100%;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.close-btn {
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
}
</style>
