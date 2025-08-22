<script setup lang="ts">
// Importa utilidades de Vue y el store de tickets
import { ref, computed, reactive, onMounted, onBeforeUnmount } from "vue";
import { useTicketStore, type Ticket } from "../store/ticketStore";

// Instancia del store de tickets
const store = useTicketStore();

// Estado reactivo para los filtros de búsqueda y selección
const search = ref("");
const statusFilter = ref<"" | "Abierto" | "En Progreso" | "Cerrado">("");
const priorityFilter = ref<"" | "Alta" | "Media" | "Baja">("");

// Estado reactivo para el menú contextual (emergente)
const ctx = reactive<{ open: boolean; x: number; y: number; ticket: Ticket | null; }>(
    { open: false, x: 0, y: 0, ticket: null }
);

// Define los eventos emitidos por el componente (ver, editar, eliminar)
const emit = defineEmits<{
    (e: "view", t: Ticket): void;
    (e: "edit", t: Ticket): void;
    (e: "delete", t: Ticket): void;
}>();

// Computed: filtra los tickets según búsqueda, estado y prioridad
const filteredTickets = computed(() =>
    store.tickets.filter((t) => {
        const byText = t.title.toLowerCase().includes(search.value.toLowerCase());
        const byStatus = !statusFilter.value || t.status === statusFilter.value;
        const byPriority = !priorityFilter.value || t.priority === priorityFilter.value;
        return byText && byStatus && byPriority;
    })
);

// Calcula la posición del menú contextual para que no se salga de la pantalla
function clampMenuPosition(x: number, y: number) {
    const MENU_W = 180, MENU_H = 132, vw = window.innerWidth, vh = window.innerHeight;
    return { x: Math.min(x, vw - MENU_W - 8), y: Math.min(y, vh - MENU_H - 8) };
}

// Abre el menú contextual en la posición del mouse y asocia el ticket
function openMenu(ev: MouseEvent, t: Ticket) {
    ev.preventDefault(); ev.stopPropagation();
    const baseX = ev.clientX ?? (ev as any).pageX ?? 0;
    const baseY = ev.clientY ?? (ev as any).pageY ?? 0;
    const { x, y } = clampMenuPosition(baseX, baseY);
    ctx.open = true; ctx.x = x; ctx.y = y; ctx.ticket = t;
    window.addEventListener("click", onWindowClick, { once: true });
}

// Cierra el menú contextual
function onWindowClick() { ctx.open = false; ctx.ticket = null; }
// Cierra el menú contextual al presionar Escape
function onKeydown(e: KeyboardEvent) { if (e.key === "Escape") onWindowClick(); }
// Cierra el menú contextual si se hace scroll o resize
function onScrollOrResize() { onWindowClick(); }

// Ejecuta la acción seleccionada en el menú contextual y emite el evento correspondiente
function choose(action: "view" | "edit" | "delete") {
    if (!ctx.ticket) return;
    const t = ctx.ticket;
    ctx.open = false; ctx.ticket = null;
    if (action === "view") emit("view", t);
    if (action === "edit") emit("edit", t);
    if (action === "delete") emit("delete", t);
}

// Añade y elimina listeners globales al montar/desmontar el componente
onMounted(() => {
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
});
onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("scroll", onScrollOrResize);
    window.removeEventListener("resize", onScrollOrResize);
});
</script>

<template>
    <div class="ticket-list">
        <h2>Lista de Tickets</h2>

        <!-- Filtros de búsqueda, estado y prioridad -->
        <div class="filters">
            <input v-model="search" type="text" placeholder="Buscar por título..." />
            <select v-model="statusFilter">
                <option value="">Estado: Todos</option>
                <option value="Abierto">Abierto</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Cerrado">Cerrado</option>
            </select>
            <select v-model="priorityFilter">
                <option value="">Prioridad: Todas</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
            </select>
        </div>

        <!-- Tabla de tickets (en mobile se muestra como tarjetas) -->
        <table class="tickets" @contextmenu.prevent>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Asignado a</th>
                    <th>Creación</th>
                </tr>
            </thead>
            <tbody>
                <!-- Cada fila representa un ticket; click/contextmenu abre el menú contextual -->
                <tr v-for="t in filteredTickets" :key="t.id" @contextmenu="openMenu($event, t)"
                    @click="openMenu($event, t)">
                    <td data-label="ID">{{ t.id }}</td>
                    <td data-label="Título">{{ t.title }}</td>
                    <td data-label="Estado">
                        <!-- Badge de estado con color según el valor -->
                        <span
                            :class="['badge', t.status === 'Abierto' ? 'open' : t.status === 'En Progreso' ? 'progress' : 'closed']">
                            {{ t.status }}
                        </span>
                    </td>
                    <td data-label="Prioridad">{{ t.priority }}</td>
                    <td data-label="Asignado a">{{ t.assignedTo || '—' }}</td>
                    <td data-label="Creación">{{ new Date(t.createdAt).toLocaleString() }}</td>
                </tr>
                <!-- Mensaje si no hay resultados -->
                <tr v-if="filteredTickets.length === 0">
                    <td class="empty" colspan="6">Sin resultados</td>
                </tr>
            </tbody>
        </table>

        <!-- Menú emergente contextual para acciones sobre el ticket -->
        <div v-if="ctx.open" class="ctx-menu" :style="{ left: ctx.x + 'px', top: ctx.y + 'px' }" role="menu"
            @click.stop>
            <button class="item" @click="choose('view')">Detalle</button>
            <button class="item" @click="choose('edit')">Editar</button>
            <button class="item danger" @click="choose('delete')">Eliminar</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.filters {
    display: grid;
    grid-template-columns: 1fr;
    gap: .6rem;
    margin: 1rem 0;

    input,
    select {
        padding: .55rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
    }
}

@media (min-width: 680px) {
    .filters {
        grid-template-columns: 2fr 1fr 1fr;
    }
}

.tickets {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: .6rem .5rem;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
}

th {
    background: #f8fafc;
}

.badge {
    padding: .2rem .5rem;
    border-radius: 6px;
    font-weight: 600
}

.badge.open {
    background: #d1fae5;
    color: #065f46
}

.badge.progress {
    background: #fef3c7;
    color: #92400e
}

.badge.closed {
    background: #fee2e2;
    color: #991b1b
}

.empty {
    text-align: center;
    color: #6b7280;
}

/* ====== MOBILE: tabla -> tarjetas ====== */
@media (max-width: 680px) {

    .tickets,
    .tickets thead,
    .tickets tbody,
    .tickets th,
    .tickets td,
    .tickets tr {
        display: block;
    }

    .tickets thead {
        /* ocultar encabezados en mobile */
        position: absolute;
        top: -9999px;
        left: -9999px;
    }

    .tickets tr {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: .6rem .75rem;
        margin-bottom: .8rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, .04);
        cursor: context-menu;
    }

    .tickets td {
        border: none;
        display: grid;
        grid-template-columns: 9rem 1fr;
        /* etiqueta / valor */
        gap: .4rem;
        padding: .25rem 0;
    }

    .tickets td::before {
        content: attr(data-label);
        font-size: .78rem;
        color: #6b7280;
        font-weight: 600;
    }

    .tickets td:last-child {
        padding-bottom: 0;
    }
}

/* Menú emergente */
.ctx-menu {
    position: fixed;
    z-index: 99999;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 10px 24px rgba(0, 0, 0, .12);
    border-radius: 10px;
    padding: 6px;
    display: flex;
    flex-direction: column;
    min-width: 180px;
}

.ctx-menu .item {
    text-align: left;
    background: transparent;
    border: 0;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    font: inherit;
}

.ctx-menu .item:hover {
    background: #f3f4f6;
}

.ctx-menu .item.danger:hover {
    background: #fee2e2;
}
</style>
