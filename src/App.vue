<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTicketStore, type Ticket } from "./store/ticketStore";

import DashboardKpis from "./components/Dashboard.vue"; // opcional, si ya lo tienes
import TicketList from "./components/TicketList.vue";
import TicketForm from "./components/TicketForm.vue";
import TicketModal from "./components/TicketModal.vue";
import Modal from "./components/Modal.vue"; // modal genérico para crear

const store = useTicketStore();

// Modales de detalle/editar
const modalOpen = ref(false);
const modalMode = ref<"view" | "edit">("view");
const modalTicket = ref<Ticket | null>(null);

// Modal de crear
const showCreate = ref(false);

onMounted(() => store.loadFromStorage());

// Handlers de la lista (menú emergente)
function handleView(t: Ticket) {
    modalMode.value = "view";
    modalTicket.value = t;
    modalOpen.value = true;
}
function handleEdit(t: Ticket) {
    modalMode.value = "edit";
    modalTicket.value = t;
    modalOpen.value = true;
}
function handleDelete(t: Ticket) {
    if (confirm(`¿Eliminar ticket #${t.id}?`)) {
        store.deleteTicket(t.id);
    }
}

// Guardado desde el modal de edición
function onModalSaved() {
    modalOpen.value = false;
}

// Abrir modal de creación
function openCreate() {
    showCreate.value = true;
}
</script>

<template>
    <div class="app">
        <header class="header">
            <h1>🎟️ TicketFast</h1>
            <button class="btn primary" @click="openCreate">➕ Crear Ticket</button>
        </header>

        <main>
            <!-- Dashboard de KPIs (si lo usas) -->
            <DashboardKpis />

            <!-- Lista con menú emergente -->
            <section class="card">
                <TicketList @view="handleView" @edit="handleEdit" @delete="handleDelete" />
            </section>
        </main>

        <!-- Modal Detalle/Editar -->
        <TicketModal v-if="modalOpen && modalTicket" :mode="modalMode" :ticket="modalTicket" @close="modalOpen = false"
            @saved="onModalSaved" />

        <!-- Modal Crear -->
        <Modal :open="showCreate" title="Crear Ticket" @close="showCreate = false">
            <TicketForm @saved="showCreate = false" />
        </Modal>
    </div>
</template>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 0;
    padding: 0 12px;
}

.card {
    background: #f6f7f9;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    margin: 16px auto;
    max-width: 1100px;
}

main {
    padding: 0 12px;
    max-width: 1140px;
    margin: 0 auto;
}

.btn {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    background: #f9fafb;
}

.btn.primary {
    background: #2563eb;
    border-color: #2563eb;
    color: #fff;
}

.btn.primary:hover {
    background: #1d4ed8;
}
</style>
