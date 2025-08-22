<script setup lang="ts">
// Importaciones de Vue y del store de tickets
import { ref, computed, reactive, onMounted, onBeforeUnmount } from "vue";
import { useTicketStore, type Ticket } from "../store/ticketStore";

// Instancia del store de tickets
const store = useTicketStore();

// Filtros de búsqueda y selección
const search = ref("");
const statusFilter = ref<"" | "Abierto" | "En Progreso" | "Cerrado">("");
const priorityFilter = ref<"" | "Alta" | "Media" | "Baja">("");

// Estado reactivo para el menú contextual
const ctx = reactive<{
    open: boolean;   // Si el menú está abierto
    x: number;       // Posición X del menú
    y: number;       // Posición Y del menú
    ticket: Ticket | null; // Ticket seleccionado en el menú
}>({ open: false, x: 0, y: 0, ticket: null });

// Definición de eventos emitidos por el componente
const emit = defineEmits<{
    (e: "view", t: Ticket): void;
    (e: "edit", t: Ticket): void;
    (e: "delete", t: Ticket): void;
}>();

// Computed para filtrar los tickets según los filtros y búsqueda
const filteredTickets = computed(() =>
    store.tickets.filter((t) => {
        const byText = t.title.toLowerCase().includes(search.value.toLowerCase());
        const byStatus = !statusFilter.value || t.status === statusFilter.value;
        const byPriority = !priorityFilter.value || t.priority === priorityFilter.value;
        return byText && byStatus && byPriority;
    })
);

// === Helpers menú ===

// Limita la posición del menú contextual para que no se salga de la pantalla
function clampMenuPosition(x: number, y: number) {
    const MENU_W = 180;
    const MENU_H = 132; // aprox 3 items
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nx = Math.min(x, vw - MENU_W - 8);
    const ny = Math.min(y, vh - MENU_H - 8);
    return { x: nx, y: ny };
}

// Abre el menú contextual en la posición del mouse y asocia el ticket
function openMenu(ev: MouseEvent, t: Ticket) {
    ev.preventDefault();
    ev.stopPropagation(); // evita que un click global cierre antes de abrir
    const baseX = ev.clientX ?? (ev as any).pageX ?? 0;
    const baseY = ev.clientY ?? (ev as any).pageY ?? 0;
    const { x, y } = clampMenuPosition(baseX, baseY);

    ctx.open = true;
    ctx.x = x;
    ctx.y = y;
    ctx.ticket = t;

    // listeners para cerrar el menú al hacer click fuera
    window.addEventListener("click", onWindowClick, { once: true });
}

// Cierra el menú contextual
function onWindowClick() {
    ctx.open = false;
    ctx.ticket = null;
}

// Cierra el menú contextual al presionar Escape
function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") onWindowClick();
}

// Cierra el menú contextual si se hace scroll o resize
function onScrollOrResize() {
    onWindowClick();
}

// Ejecuta la acción seleccionada en el menú contextual
function choose(action: "view" | "edit" | "delete") {
    if (!ctx.ticket) return;
    const t = ctx.ticket;
    ctx.open = false;
    ctx.ticket = null;
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

        <!-- Tabla de tickets -->
        <!-- @contextmenu y @click abren el menú contextual -->
        <table @contextmenu.prevent>
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
                <tr v-for="t in filteredTickets" :key="t.id" @contextmenu="openMenu($event, t)"
                    @click="openMenu($event, t)">
                    <td>{{ t.id }}</td>
                    <td>{{ t.title }}</td>
                    <td>
                        <!-- Badge de estado con color según el valor -->
                        <span
                            :class="['badge', t.status === 'Abierto' ? 'open' : t.status === 'En Progreso' ? 'progress' : 'closed']">
                            {{ t.status }}
                        </span>
                    </td>
                    <td>{{ t.priority }}</td>
                    <td>{{ new Date(t.createdAt).toLocaleString() }}</td>
                </tr>
                <tr v-if="filteredTickets.length === 0">
                    <td colspan="5">Sin resultados</td>
                </tr>
            </tbody>
        </table>

        <!-- Menú contextual emergente -->
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
    display: flex;
    gap: .6rem;
    margin: 1rem 0;

    input,
    select {
        padding: .5rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
    }
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: .6rem;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
}

th {
    background: #f8fafc;
}

tr {
    cursor: context-menu;
}

.badge {
    padding: .2rem .5rem;
    border-radius: 6px;
    font-weight: 600;
}

.badge.open {
    background: #d1fae5;
    color: #065f46;
}

.badge.progress {
    background: #fef3c7;
    color: #92400e;
}

.badge.closed {
    background: #fee2e2;
    color: #991b1b;
}

/* Menú emergente */
.ctx-menu {
    position: fixed;
    /* clave para usar clientX/clientY */
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
