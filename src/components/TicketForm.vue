<script setup lang="ts">
import { reactive, watch } from "vue";
import { useTicketStore, type Ticket, type TicketPriority, type TicketStatus } from "../store/ticketStore";

const store = useTicketStore();

const props = defineProps<{ model?: Ticket | null }>();
const emit = defineEmits<{ (e: "saved"): void }>();

const form = reactive<Omit<Ticket, "id" | "createdAt" | "updatedAt">>({
    title: "",
    description: "",
    status: "Abierto",
    priority: "Media",
    assignedTo: "",
});

watch(
    () => props.model,
    (m) => {
        if (m) {
            // Modo edición
            form.title = m.title;
            form.description = m.description;
            form.status = m.status as TicketStatus;
            form.priority = m.priority as TicketPriority;
            form.assignedTo = m.assignedTo ?? "";
        } else {
            // Modo crear
            form.title = "";
            form.description = "";
            form.status = "Abierto";
            form.priority = "Media";
            form.assignedTo = "";
        }
    },
    { immediate: true }
);

function submitForm() {
    if (!form.title.trim() || !form.description.trim()) return;

    if (props.model) {
        store.updateTicket(props.model.id, { ...form });
    } else {
        store.addTicket({ ...form });
    }
    emit("saved");
}
</script>

<template>
    <div class="ticket-form">
        <h2>➕ {{ props.model ? "Editar Ticket" : "Crear Ticket" }}</h2>

        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="title">Título *</label>
                <input id="title" v-model="form.title" type="text" placeholder="Título" />
            </div>

            <div class="form-group">
                <label for="description">Descripción *</label>
                <textarea id="description" v-model="form.description" placeholder="Descripción" />
            </div>

            <div class="form-inline">
                <div class="form-group">
                    <label for="status">Estado</label>
                    <select id="status" v-model="form.status">
                        <option value="Abierto">Abierto</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Cerrado">Cerrado</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="priority">Prioridad</label>
                    <select id="priority" v-model="form.priority">
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="assignedTo">Asignado a</label>
                <input id="assignedTo" v-model="form.assignedTo" type="text" placeholder="Nombre del responsable" />
            </div>

            <button type="submit">{{ props.model ? "Guardar Cambios" : "Crear Ticket" }}</button>
        </form>
    </div>
</template>

<style scoped lang="scss">
.ticket-form {
    h2 {
        margin-bottom: 1rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    .form-inline {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.8rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    input,
    textarea,
    select {
        padding: 0.55rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
    }

    button {
        align-self: flex-start;
        background: #22c55e;
        color: #fff;
        border: 0;
        padding: 0.6rem 1rem;
        border-radius: 8px;
        cursor: pointer;
    }

    button:hover {
        background: #16a34a;
    }
}
</style>
