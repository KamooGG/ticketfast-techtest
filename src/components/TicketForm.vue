<script setup lang="ts">
import { ref } from "vue";
import { useTicketStore } from "../store/ticketStore";

const store = useTicketStore();

const title = ref("");
const description = ref("");
const status = ref("Abierto");
const priority = ref("Media");
const assignedTo = ref("");

function submitForm() {
    if (!title.value || !description.value) {
        alert("Por favor llena todos los campos obligatorios");
        return;
    }

    store.addTicket({
        title: title.value,
        description: description.value,
        status: status.value as "Abierto" | "En Progreso" | "Cerrado",
        priority: priority.value as "Alta" | "Media" | "Baja",
        assignedTo: assignedTo.value || null,
    });

    // Resetear formulario
    title.value = "";
    description.value = "";
    status.value = "Abierto";
    priority.value = "Media";
    assignedTo.value = "";
}
</script>

<template>
    <div class="ticket-form">
        <h2>➕ Crear Ticket</h2>

        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="title">Título *</label>
                <input id="title" v-model="title" type="text" placeholder="Título" />
            </div>

            <div class="form-group">
                <label for="description">Descripción *</label>
                <textarea id="description" v-model="description" placeholder="Descripción"></textarea>
            </div>

            <div class="form-group">
                <label for="status">Estado</label>
                <select id="status" v-model="status">
                    <option value="Abierto">Abierto</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Cerrado">Cerrado</option>
                </select>
            </div>

            <div class="form-group">
                <label for="priority">Prioridad</label>
                <select id="priority" v-model="priority">
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>
            </div>

            <div class="form-group">
                <label for="assignedTo">Asignado a</label>
                <input id="assignedTo" v-model="assignedTo" type="text" placeholder="Nombre del responsable" />
            </div>

            <button type="submit">Crear Ticket</button>
        </form>
    </div>
</template>

<style scoped lang="scss">
.ticket-form {
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 1.5rem;

    h2 {
        margin-bottom: 1rem;
    }

    .form-group {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;

        label {
            font-weight: bold;
            margin-bottom: 0.3rem;
        }

        input,
        textarea,
        select {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 6px;
        }
    }

    button {
        background: #2ecc71;
        color: white;
        border: none;
        padding: 0.6rem 1rem;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
            background: #27ae60;
        }
    }
}
</style>
