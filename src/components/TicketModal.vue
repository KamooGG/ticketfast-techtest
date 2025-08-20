<script setup lang="ts">
import { reactive, watch, computed } from "vue";
import { useTicketStore, type Ticket, type TicketPriority, type TicketStatus } from "../store/ticketStore";

const store = useTicketStore();

const props = defineProps<{
    mode: "view" | "edit";   // 'view' = detalle solo lectura, 'edit' = editar
    ticket: Ticket;          // ticket a mostrar/editar
}>();
const emit = defineEmits<{
    (e: "close"): void;
    (e: "saved"): void;
}>();

// Clon editable para no mutar directamente el store hasta guardar
const form = reactive<Ticket>({ ...props.ticket });

watch(() => props.ticket, (t) => {
    Object.assign(form, t);
}, { immediate: true, deep: true });

const isView = computed(() => props.mode === "view");

function save() {
    if (isView.value) return;
    // Guardar cambios (ID no se edita)
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
    <div class="overlay" @click.self="emit('close')">
        <div class="modal">
            <header class="head">
                <h3>{{ isView ? "Detalle de Ticket" : "Editar Ticket" }}</h3>
                <button class="x" @click="emit('close')">✖</button>
            </header>

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
                    <input v-model="form.assignedTo" :disabled="isView" placeholder="Nombre del responsable" />
                </div>

                <div>
                    <label>Creado</label>
                    <input :value="new Date(form.createdAt).toLocaleString()" disabled />
                </div>

                <div>
                    <label>Actualizado</label>
                    <input :value="new Date(form.updatedAt).toLocaleString()" disabled />
                </div>

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
</style>
