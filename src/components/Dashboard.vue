<template>
    <!-- KPIs -->
    <section class="kpis card">
        <div class="kpi">
            <span class="label">Total</span>
            <span class="value">{{ total }}</span>
        </div>
        <div class="kpi kpi-open">
            <span class="label">Abiertos</span>
            <span class="value">{{ abiertos }}</span>
        </div>
        <div class="kpi kpi-progress">
            <span class="label">En Progreso</span>
            <span class="value">{{ enProgreso }}</span>
        </div>
        <div class="kpi kpi-closed">
            <span class="label">Cerrados</span>
            <span class="value">{{ cerrados }}</span>
        </div>
    </section>

    <!-- Gráficos -->
    <section class="grid-graphs">
        <article class="card chart-wrap">
            <header class="chart-header">
                <h3>Tickets por estado</h3>
            </header>
            <canvas ref="statusCanvas" aria-label="Gráfico por estado"></canvas>
        </article>

        <article class="card chart-wrap">
            <header class="chart-header">
                <h3>Tickets por prioridad</h3>
            </header>
            <canvas ref="priorityCanvas" aria-label="Gráfico por prioridad"></canvas>
        </article>
    </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useTicketStore } from "../store/ticketStore";
import Chart from "chart.js/auto";

const store = useTicketStore();

// Refs de canvas
const statusCanvas = ref<HTMLCanvasElement | null>(null);
const priorityCanvas = ref<HTMLCanvasElement | null>(null);

// Instancias de Chart.js
let statusChart: Chart | null = null;
let priorityChart: Chart | null = null;

// KPIs
const total = computed(() => store.tickets.length);
const abiertos = computed(() => store.tickets.filter(t => t.status === "Abierto").length);
const enProgreso = computed(() => store.tickets.filter(t => t.status === "En Progreso").length);
const cerrados = computed(() => store.tickets.filter(t => t.status === "Cerrado").length);

// Cálculo por prioridad
const alta = computed(() => store.tickets.filter(t => t.priority === "Alta").length);
const media = computed(() => store.tickets.filter(t => t.priority === "Media").length);
const baja = computed(() => store.tickets.filter(t => t.priority === "Baja").length);

function upsertStatusChart() {
    if (!statusCanvas.value) return;
    const data = [abiertos.value, enProgreso.value, cerrados.value];

    if (statusChart) {
        statusChart.data.datasets[0].data = data;
        statusChart.update();
        return;
    }

    statusChart = new Chart(statusCanvas.value.getContext("2d")!, {
        type: "doughnut",
        data: {
            labels: ["Abiertos", "En Progreso", "Cerrados"],
            datasets: [
                {
                    data,
                    backgroundColor: ["#86efac", "#fde68a", "#fca5a5"],
                    borderColor: ["#22c55e", "#f59e0b", "#ef4444"],
                    borderWidth: 1,
                },
            ],
        },
        options: { plugins: { legend: { position: "bottom" } }, responsive: true, maintainAspectRatio: false },
    });
}

function upsertPriorityChart() {
    if (!priorityCanvas.value) return;
    const data = [alta.value, media.value, baja.value];

    if (priorityChart) {
        priorityChart.data.datasets[0].data = data;
        priorityChart.update();
        return;
    }

    priorityChart = new Chart(priorityCanvas.value.getContext("2d")!, {
        type: "bar",
        data: {
            labels: ["Alta", "Media", "Baja"],
            datasets: [
                {
                    data,
                    backgroundColor: ["#f87171", "#fb923c", "#60a5fa"],
                    borderColor: ["#ef4444", "#f97316", "#3b82f6"],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } },
            },
        },
    });
}

function refreshCharts() {
    upsertStatusChart();
    upsertPriorityChart();
}

onMounted(() => {
    if (!store.tickets.length) store.loadFromStorage();
    refreshCharts();
});

// Actualiza gráficos cuando cambien los tickets (crear/editar/eliminar)
watch(() => store.tickets, () => refreshCharts(), { deep: true });

onBeforeUnmount(() => {
    statusChart?.destroy(); statusChart = null;
    priorityChart?.destroy(); priorityChart = null;
});
</script>

<style scoped lang="scss">
.kpis {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin: 16px auto;
}

@media (min-width: 720px) {
    .kpis {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}

.kpi {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .label {
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: .04em;
    }

    .value {
        font-size: 28px;
        font-weight: 800;
        color: #111827;
    }
}

.kpi-open {
    border-top: 4px solid #22c55e;
}

.kpi-progress {
    border-top: 4px solid #f59e0b;
}

.kpi-closed {
    border-top: 4px solid #ef4444;
}

.grid-graphs {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

@media (min-width: 900px) {
    .grid-graphs {
        grid-template-columns: 1fr 1fr;
    }
}

.chart-wrap {
    height: 320px;
    padding: 16px;
}

.chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}
</style>
