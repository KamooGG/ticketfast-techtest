<template>
    <div class="dashboard-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
            <h2 class="logo">🎟️ TicketFast</h2>
            <nav>
                <RouterLink to="/" class="nav-link" exact-active-class="active">Dashboard</RouterLink>
                <RouterLink to="/tickets" class="nav-link" exact-active-class="active">Tickets</RouterLink>
            </nav>
        </aside>

        <!-- Main content -->
        <div class="main">
            <!-- Topbar -->
            <header class="topbar">
                <h1>{{ currentTitle }}</h1>
                <button class="logout-btn">Cerrar sesión</button>
            </header>

            <!-- Page -->
            <main class="content">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const currentTitle = computed(() => {
    switch (route.name) {
        case 'Dashboard': return 'Panel principal'
        case 'Tickets': return 'Gestión de Tickets'
        case 'TicketDetail': return 'Detalle de Ticket'
        default: return ''
    }
})
</script>

<style lang="scss" scoped>
.dashboard-layout {
    display: flex;
    height: 100vh;
    background: #f8f9fa;
}

.sidebar {
    width: 220px;
    background: #1e1e2f;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 1rem;

    .logo {
        margin-bottom: 2rem;
        font-size: 1.4rem;
    }

    nav {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .nav-link {
        color: #cbd5e1;
        text-decoration: none;
        padding: 0.5rem;
        border-radius: 6px;
        transition: background 0.2s;

        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        &.active {
            background: #3b82f6;
            color: white;
        }
    }
}

.main {
    flex: 1;
    display: flex;
    flex-direction: column;

    .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 1rem 2rem;
        border-bottom: 1px solid #e2e8f0;
    }

    .content {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
    }

    .logout-btn {
        background: #ef4444;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
            background: #dc2626;
        }
    }
}
</style>
