<script setup lang="ts">
import { ref, computed } from "vue";
import { useTicketStore, type Ticket } from "../store/ticketStore";

const store = useTicketStore();

// filtros
const search = ref("");
const statusFilter = ref<"" | "Abierto" | "En Progreso" | "Cerrado">("");

// tickets filtrados
const filteredTickets = computed(() => {
    return store.tickets.filter((ticket: Ticket) => {
        const matchesSearch = ticket.title
            .toLowerCase()
            .includes(search.value.toLowerCase());

        const matchesStatus =
            statusFilter.value === "" || ticket.status === statusFilter.value;

        return matchesSearch && matchesStatus;
    });
});
</script>

<template>
    <div class="ticket-list">
        <h2>📋 Lista de Tickets</h2>

        <!-- Controles de filtros -->
        <div class="filters">
            <input v-model="search" type="text" placeholder="Buscar por título..." />

            <select v-model="statusFilter">
                <option value="">Todos</option>
                <option value="Abierto">Abierto</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Cerrado">Cerrado</option>
            </select>
        </div>

        <!-- Tabla de tickets -->
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Creación</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ticket in filteredTickets" :key="ticket.id">
                    <td>{{ ticket.id }}</td>
                    <td>
                        <router-link :to="`/ticket/${ticket.id}`">
                            {{ ticket.title }}
                        </router-link>
                    </td>
                    <td>{{ ticket.status }}</td>
                    <td>{{ ticket.priority }}</td>
                    <td>{{ new Date(ticket.createdAt).toLocaleString() }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped lang="scss">
.ticket-list {
    padding: 1rem;

    h2 {
        margin-bottom: 1rem;
    }

    .filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;

        input,
        select {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 6px;
        }
    }

    table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
            padding: 0.6rem;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }

        th {
            background: #f8f8f8;
        }
    }
}
</style>
