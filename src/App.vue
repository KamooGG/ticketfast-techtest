<script setup lang="ts">
import TicketForm from "./components/TicketForm.vue";
import TicketList from "./components/TicketList.vue";
</script>

<template>
    <div class="app">
        <header>
            <h1>🎟️ TicketFast</h1>
        </header>

        <main>
            <TicketForm />
            <TicketList />
        </main>
    </div>
</template>

<style scoped lang="scss">
.app {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: #fff;

    header {
        text-align: center;
        margin-bottom: 2rem;

        h1 {
            font-size: 2rem;
            color: #2c3e50;
        }
    }

    main {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
}
</style>
