<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTicketStore, type Ticket } from "../store/ticketStore";

const route = useRoute();
const router = useRouter();
const store = useTicketStore();

const ticketId = Number(route.params.id);

const ticket = computed<Ticket | undefined>(() =>
    store.tickets.find((t) => t.id === ticketId)
);

function goBack() {
    router.push("/");
}
</script>

<template>
    <div v-if="ticket" class="ticket-detail">
        <h2>🎫 Detalle del Ticket #{{ ticket.id }}</h2>

        <p><strong>Título:</strong> {{ ticket.title }}</p>
        <p><strong>Descripción:</strong> {{ ticket.description }}</p>
        <p><strong>Estado:</strong> {{ ticket.status }}</p>
        <p><strong>Prioridad:</strong> {{ ticket.priority }}</p>
        <p><strong>Creado:</strong> {{ new Date(ticket.createdAt).toLocaleString() }}</p>
        <p><strong>Última actualización:</strong> {{ new Date(ticket.updatedAt).toLocaleString() }}</p>

        <button @click="goBack">⬅️ Volver</button>
    </div>
    <div v-else>
        <p>⚠️ Ticket no encontrado</p>
        <button @click="goBack">⬅️ Volver</button>
    </div>
</template>

<style scoped lang="scss">
.ticket-detail {
    padding: 1rem;

    h2 {
        margin-bottom: 1rem;
    }

    p {
        margin: 0.3rem 0;
    }

    button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        background: #42b883;
        color: white;
        cursor: pointer;

        &:hover {
            background: #369f72;
        }
    }
}
</style>
