<script setup lang="ts">
// Importa utilidades de Vue y el store de tickets
import { reactive, watch, computed } from "vue";
import {
    useTicketStore,
    type Ticket,
    type TicketPriority,
    type TicketStatus,
} from "../store/ticketStore";
import users from "../data/users.json";

// Define el tipo para los usuarios del sistema
type User = { id: number; nombre: string; email: string; rol: string };

// Instancia del store de tickets
const store = useTicketStore();

// Props: recibe un ticket para editar (opcional)
const props = defineProps<{ model?: Ticket | null }>();
// Evento emitido al guardar el ticket
const emit = defineEmits<{ (e: "saved"): void }>();

// Estado reactivo del formulario, omitiendo id, createdAt y updatedAt
const form = reactive<Omit<Ticket, "id" | "createdAt" | "updatedAt">>({
    title: "",
    description: "",
    status: "Abierto",
    priority: "Media",
    assignedTo: "",
});

// Observa cambios en la prop 'model' para rellenar el formulario en modo edición
watch(
    () => props.model,
    (m) => {
        if (m) {
            // Si hay modelo, carga los datos para edición
            form.title = m.title;
            form.description = m.description;
            form.status = m.status as TicketStatus;
            form.priority = m.priority as TicketPriority;
            form.assignedTo = m.assignedTo ?? "";
        } else {
            // Si no hay modelo, limpia el formulario (modo crear)
            form.title = "";
            form.description = "";
            form.status = "Abierto";
            form.priority = "Media";
            form.assignedTo = "";
        }
    },
    { immediate: true }
);

// Computed para las opciones del select de usuarios (asignación)
const userOptions = computed(() =>
    (users as User[]).map((u) => ({
        value: u.nombre,
        label: `${u.nombre} — ${u.rol}`,
    }))
);

// Envía el formulario: valida y llama a addTicket o updateTicket según corresponda
function submitForm() {
    if (!form.title.trim() || !form.description.trim()) return;
    if (props.model) {
        // Si hay modelo, actualiza el ticket existente
        store.updateTicket(props.model.id, { ...form });
    } else {
        // Si no hay modelo, crea un nuevo ticket
        store.addTicket({ ...form });
    }
    emit("saved"); // Emite evento para notificar que se guardó
}
</script>

<template>
    <div class="ticket-form">
        <!-- Título dinámico según modo -->
        <h2>{{ props.model ? "Editar Ticket" : "Crear Ticket" }}</h2>

        <!-- Formulario de ticket -->
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
                <select id="assignedTo" v-model="form.assignedTo">
                    <option value="">-- Seleccionar --</option>
                    <option v-for="opt in userOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>
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

    @media (max-width: 680px) {
        .form-inline {
            grid-template-columns: 1fr;
        }

        button {
            width: 100%;
        }
    }
}
</style>
