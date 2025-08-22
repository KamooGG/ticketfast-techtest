<script setup lang="ts">
// Importa utilidades de Vue y el store de tickets
import { reactive, watch, computed } from "vue";
import {
    useTicketStore,
    type Ticket,
    type TicketPriority,
    type TicketStatus,
} from "../store/ticketStore";
import users from "@/data/users.json";

// Define el tipo para los usuarios del sistema
type User = { id: number; nombre: string; email: string; rol: string };

// Instancia del store de tickets
const store = useTicketStore();

// Props: recibe el modo ("view" o "edit") y el ticket a mostrar/editar
const props = defineProps<{ mode: "view" | "edit"; ticket: Ticket }>();
// Define los eventos que puede emitir el modal: cerrar y guardar
const emit = defineEmits<{ (e: "close"): void; (e: "saved"): void }>();

// Estado reactivo del formulario, copia los datos del ticket recibido por props
const form = reactive<Ticket>({ ...props.ticket });

// Sincroniza el formulario cuando cambian las props del ticket
watch(() => props.ticket, (t) => Object.assign(form, t), { immediate: true, deep: true });

// Computed: determina si el modal está en modo solo lectura (detalle)
const isView = computed(() => props.mode === "view");

// Computed: obtiene el usuario seleccionado según el nombre asignado
const selectedUser = computed<User | undefined>(() =>
    (users as User[]).find((u) => u.nombre === form.assignedTo)
);

// Computed: opciones para el select de usuarios
const userOptions = computed(() =>
    (users as User[]).map((u) => ({
        value: u.nombre,
        label: `${u.nombre} — ${u.rol}`,
    }))
);

// Guarda los cambios del formulario si está en modo edición
function save() {
    if (isView.value) return;
    store.updateTicket(props.ticket.id, {
        title: form.title,
        description: form.description,
        status: form.status as TicketStatus,
        priority: form.priority as TicketPriority,
        assignedTo: form.assignedTo,
    });
    emit("saved");
}
</script>

<template>
    <!-- Overlay que oscurece el fondo y cierra el modal al hacer click fuera -->
    <div class="overlay" @click.self="emit('close')">
        <div class="modal">
            <!-- Encabezado con título dinámico y botón de cerrar -->
            <header class="head">
                <h3>{{ isView ? "Detalle de Ticket" : "Editar Ticket" }}</h3>
                <button class="x" @click="emit('close')">✖</button>
            </header>

            <!-- Formulario con los datos del ticket (lectura o edición) -->
            <form class="grid" @submit.prevent="save">
                <div>
                    <label>ID</label>
                    <input :value="form.id" disabled />
                </div>

                <div>
                    <label>Título</label>
                    <input v-model="form.title" :disabled="isView" />
                </div>

                <div class="full">
                    <label>Descripción</label>
                    <textarea v-model="form.description" rows="3" :disabled="isView"></textarea>
                </div>

                <div>
                    <label>Estado</label>
                    <select v-model="form.status" :disabled="isView">
                        <option value="Abierto">Abierto</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Cerrado">Cerrado</option>
                    </select>
                </div>

                <div>
                    <label>Prioridad</label>
                    <select v-model="form.priority" :disabled="isView">
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                    </select>
                </div>

                <div>
                    <label>Asignado a</label>
                    <select v-model="form.assignedTo" :disabled="isView">
                        <option value="">-- Seleccionar --</option>
                        <option v-for="opt in userOptions" :key="opt.value" :value="opt.value">
                            {{ opt.label }}
                        </option>
                    </select>
                </div>

                <!-- Muestra información adicional del usuario seleccionado -->
                <div v-if="selectedUser">
                    <label>Email</label>
                    <input :value="selectedUser.email" disabled />
                </div>

                <div v-if="selectedUser">
                    <label>Rol</label>
                    <input :value="selectedUser.rol" disabled />
                </div>

                <div>
                    <label>Creado</label>
                    <input :value="new Date(form.createdAt).toLocaleString()" disabled />
                </div>

                <div>
                    <label>Actualizado</label>
                    <input :value="new Date(form.updatedAt).toLocaleString()" disabled />
                </div>

                <!-- Acciones del modal: cerrar y guardar (si está en modo edición) -->
                <footer class="actions full">
                    <button type="button" class="btn" @click="emit('close')">Cerrar</button>
                    <button v-if="!isView" type="submit" class="btn primary">Guardar</button>
                </footer>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.modal {
    width: min(760px, 92vw);
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 18px 40px rgba(0, 0, 0, .2);
}

.head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.x {
    background: transparent;
    border: 0;
    font-size: 18px;
    cursor: pointer;
}

.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.full {
    grid-column: 1 / -1;
}

label {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
}

input,
select,
textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
}

.btn {
    padding: .55rem .9rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    cursor: pointer;
}

.btn.primary {
    background: #22c55e;
    border-color: #22c55e;
    color: #fff;
}

/* Responsive */
@media (max-width: 680px) {
    .modal {
        width: 95vw;
        padding: 12px;
    }

    .grid {
        grid-template-columns: 1fr;
    }

    .full {
        grid-column: 1;
    }

    .actions {
        flex-direction: column-reverse;
        align-items: stretch;
    }

    .btn,
    .btn.primary {
        width: 100%;
    }
}
</style>
