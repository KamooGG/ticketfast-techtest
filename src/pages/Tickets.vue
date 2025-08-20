<template>
    <div class="tickets">
        <h2>Gestión de Tickets</h2>

        <!-- Filtros y búsqueda -->
        <div class="filters">
            <input type="text" v-model="search" placeholder="Buscar por título..." />

            <select v-model="statusFilter">
                <option value="">Todos</option>
                <option value="Abierto">Abierto</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Cerrado">Cerrado</option>
            </select>

            <button @click="openForm()">➕ Nuevo Ticket</button>
        </div>

        <!-- Tabla de tickets -->
        <table>
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Última actualización</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ticket in filteredTickets" :key="ticket.id">
                    <td>{{ ticket.title }}</td>
                    <td>
                        <span :class="['status', ticket.status.toLowerCase().replace(' ', '-')]">
                            {{ ticket.status }}
                        </span>
                    </td>
                    <td>{{ formatDate(ticket.updatedAt) }}</td>
                    <td>
                        <button @click="openForm(ticket)">✏️ Editar</button>
                        <button @click="deleteTicket(ticket.id)">🗑️ Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal para crear/editar -->
        <div v-if="showModal" class="modal-backdrop">
            <div class="modal">
                <h3>{{ currentTicket?.id ? 'Editar Ticket' : 'Nuevo Ticket' }}</h3>

                <form @submit.prevent="saveTicket">
                    <label>Título</label>
                    <input v-model="form.title" required />

                    <label>Descripción</label>
                    <textarea v-model="form.description" required></textarea>

                    <label>Estado</label>
                    <select v-model="form.status">
                        <option value="Abierto">Abierto</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Cerrado">Cerrado</option>
                    </select>

                    <label>Prioridad</label>
                    <select v-model="form.priority">
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                    </select>

                    <label>Asignar a</label>
                    <input v-model="form.assignedTo" placeholder="Usuario asignado" />

                    <div class="actions">
                        <button type="submit">💾 Guardar</button>
                        <button type="button" @click="closeForm">❌ Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useTicketStore } from '../store/ticketStore'

const ticketStore = useTicketStore()

const search = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const currentTicket = ref<any>(null)

const form = ref({
    title: '',
    description: '',
    status: 'Abierto',
    priority: 'Media', // Agrega esta línea
    assignedTo: ''     // Agrega esta línea si quieres usarlo
})

const filteredTickets = computed(() => {
    return ticketStore.tickets.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.value.toLowerCase())
        const matchesStatus = statusFilter.value ? t.status === statusFilter.value : true
        return matchesSearch && matchesStatus
    })
})

function formatDate(date: string) {
    return new Date(date).toLocaleString()
}

function openForm(ticket: any = null) {
    if (ticket) {
        currentTicket.value = ticket
        form.value = { ...ticket }
    } else {
        currentTicket.value = null
        form.value = { title: '', description: '', status: 'Abierto', priority: 'Media', assignedTo: '' }
    }
    showModal.value = true
}

function closeForm() {
    showModal.value = false
}

function saveTicket() {
    const ticketData = {
        title: form.value.title,
        description: form.value.description,
        status: form.value.status as "Abierto" | "En Progreso" | "Cerrado",
        priority: form.value.priority as "Alta" | "Media" | "Baja", // Agrega esta línea
        assignedTo: form.value.assignedTo || null // Agrega esta línea si quieres usarlo
    };
    if (currentTicket.value) {
        ticketStore.updateTicket(currentTicket.value.id, ticketData);
    } else {
        ticketStore.addTicket(ticketData);
    }
    closeForm();
}

function deleteTicket(id: number) {
    if (confirm('¿Seguro que quieres eliminar este ticket?')) {
        ticketStore.deleteTicket(id)
    }
}
</script>

<style lang="scss" scoped>
.tickets {
    h2 {
        margin-bottom: 1.5rem;
    }

    .filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;

        input,
        select,
        button {
            padding: 0.5rem;
            border-radius: 6px;
            border: 1px solid #ccc;
        }

        button {
            cursor: pointer;
            background: #4f46e5;
            color: white;
            border: none;
        }
    }

    table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
            padding: 0.75rem;
            border-bottom: 1px solid #ddd;
        }

        th {
            text-align: left;
        }

        .status {
            padding: 0.2rem 0.6rem;
            border-radius: 4px;
            font-size: 0.9rem;

            &.abierto {
                background: #fee2e2;
                color: #b91c1c;
            }

            &.en-progreso {
                background: #fef9c3;
                color: #92400e;
            }

            &.cerrado {
                background: #dcfce7;
                color: #166534;
            }
        }
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;

        .modal {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            width: 400px;
            max-width: 90%;

            form {
                display: flex;
                flex-direction: column;
                gap: 0.8rem;

                input,
                textarea,
                select {
                    padding: 0.5rem;
                    border-radius: 6px;
                    border: 1px solid #ccc;
                }

                .actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1rem;

                    button {
                        padding: 0.5rem 1rem;
                        border-radius: 6px;
                        cursor: pointer;
                    }

                    button[type="submit"] {
                        background: #22c55e;
                        color: white;
                        border: none;
                    }

                    button[type="button"] {
                        background: #ef4444;
                        color: white;
                        border: none;
                    }
                }
            }
        }
    }
}
</style>
