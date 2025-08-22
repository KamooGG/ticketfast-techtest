<script setup lang="ts">
// Importa utilidades de Vue y el store de tickets
import { ref, onMounted } from "vue";
import { useTicketStore, type Ticket } from "./store/ticketStore";

// Importa componentes de la aplicación
import DashboardKpis from "./components/Dashboard.vue"; // Dashboard de KPIs
import TicketList from "./components/TicketList.vue";   // Lista de tickets
import TicketForm from "./components/TicketForm.vue";   // Formulario de ticket
import TicketModal from "./components/TicketModal.vue"; // Modal de detalle/edición
import Modal from "./components/Modal.vue";             // Modal genérico para crear

const store = useTicketStore();

// Estado para controlar el modal de detalle/edición
const modalOpen = ref(false);                  // Si el modal está abierto
const modalMode = ref<"view" | "edit">("view");// Modo del modal: ver o editar
const modalTicket = ref<Ticket | null>(null);  // Ticket seleccionado en el modal

// Estado para controlar el modal de creación
const showCreate = ref(false);                 // Si el modal de crear está abierto

// Al montar el componente, carga los tickets desde localStorage
onMounted(() => store.loadFromStorage());

// Handler para ver detalles de un ticket (abre el modal en modo "view")
function handleView(t: Ticket) {
    modalMode.value = "view";
    modalTicket.value = t;
    modalOpen.value = true;
}
// Handler para editar un ticket (abre el modal en modo "edit")
function handleEdit(t: Ticket) {
    modalMode.value = "edit";
    modalTicket.value = t;
    modalOpen.value = true;
}
// Handler para eliminar un ticket (confirma antes de eliminar)
function handleDelete(t: Ticket) {
    if (confirm(`¿Eliminar ticket #${t.id}?`)) {
        store.deleteTicket(t.id);
    }
}

// Handler que se ejecuta al guardar cambios en el modal de edición
function onModalSaved() {
    modalOpen.value = false;
}

// Abre el modal de creación de ticket
function openCreate() {
    showCreate.value = true;
}
</script>

<template>
    <div class="app">
        <main>
            <!-- Encabezado con título y botón para crear ticket -->
            <header class="header">
                <h1>Ticket Manager</h1>
                <button class="btn primary" @click="openCreate">+ Crear Ticket</button>
            </header>
            <!-- Dashboard de KPIs (indicadores) -->
            <DashboardKpis />

            <!-- Sección con la lista de tickets y menú contextual -->
            <section class="card">
                <TicketList @view="handleView" @edit="handleEdit" @delete="handleDelete" />
            </section>
        </main>

        <!-- Modal para ver o editar ticket -->
        <TicketModal v-if="modalOpen && modalTicket" :mode="modalMode" :ticket="modalTicket" @close="modalOpen = false"
            @saved="onModalSaved" />

        <!-- Modal para crear un nuevo ticket -->
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
    gap: 8px;
}

.header .btn {
    padding: 8px 12px;
    border-radius: 8px;
}

main {
    padding: 0 12px;
    max-width: 1140px;
    margin: 0 auto;
}

.card {
    background: #f6f7f9;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    margin: 16px auto;
    max-width: 1100px;
}

@media (max-width: 680px) {
    .header {
        flex-direction: column;
        align-items: stretch;
    }

    .header h1 {
        text-align: center;
        margin: 0;
    }

    .header .btn {
        width: 100%;
    }

    .card {
        padding: 12px;
    }
}
</style>
