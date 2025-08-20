<template>
    <div class="dashboard">
        <h2>Resumen de Tickets</h2>

        <!-- Tarjetas resumen -->
        <div class="cards">
            <div class="card">
                <h3>Total</h3>
                <p>{{ stats.total }}</p>
            </div>
            <div class="card open">
                <h3>Abiertos</h3>
                <p>{{ stats.open }}</p>
            </div>
            <div class="card in-progress">
                <h3>En Progreso</h3>
                <p>{{ stats.inProgress }}</p>
            </div>
            <div class="card closed">
                <h3>Cerrados</h3>
                <p>{{ stats.closed }}</p>
            </div>
        </div>

        <!-- Gráfico simple -->
        <div class="chart">
            <canvas id="ticketChart"></canvas>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useTicketStore } from '../store/ticketStore'
import Chart from 'chart.js/auto'

const ticketStore = useTicketStore()

const stats = computed(() => {
    return {
        total: ticketStore.tickets.length,
        open: ticketStore.tickets.filter(t => t.status === 'Abierto').length,
        inProgress: ticketStore.tickets.filter(t => t.status === 'En Progreso').length,
        closed: ticketStore.tickets.filter(t => t.status === 'Cerrado').length
    }
})

onMounted(() => {
    const ctx = document.getElementById('ticketChart') as HTMLCanvasElement
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Abiertos', 'En Progreso', 'Cerrados'],
            datasets: [
                {
                    data: [stats.value.open, stats.value.inProgress, stats.value.closed],
                    backgroundColor: ['#f87171', '#facc15', '#4ade80']
                }
            ]
        }
    })
})
</script>

<style lang="scss" scoped>
.dashboard {
    h2 {
        margin-bottom: 1.5rem;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;

        .card {
            background: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            text-align: center;

            h3 {
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }

            p {
                font-size: 1.6rem;
                font-weight: bold;
            }

            &.open {
                border-top: 4px solid #f87171;
            }

            &.in-progress {
                border-top: 4px solid #facc15;
            }

            &.closed {
                border-top: 4px solid #4ade80;
            }
        }
    }

    .chart {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        max-width: 500px;
    }
}
</style>
