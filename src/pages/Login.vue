<template>
    <div class="login-page">
        <h1>Iniciar Sesión</h1>
        <form @submit.prevent="handleLogin">
            <div>
                <label for="email">Correo:</label>
                <input id="email" v-model="email" type="email" required />
            </div>

            <div>
                <label for="password">Contraseña:</label>
                <input id="password" v-model="password" type="password" required />
            </div>

            <button type="submit">Entrar</button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");

function handleLogin() {
    // Aquí luego puedes conectar con tu backend o auth
    console.log("Login con:", email.value, password.value);
}
</script>

<style scoped lang="scss">
.login-page {
    max-width: 400px;
    margin: 3rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 12px;
    background: #fafafa;

    h1 {
        margin-bottom: 1rem;
        text-align: center;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input {
        padding: 0.6rem;
        border-radius: 8px;
        border: 1px solid #bbb;
    }

    button {
        padding: 0.8rem;
        border: none;
        background: #42b883;
        color: white;
        border-radius: 8px;
        cursor: pointer;
    }

    button:hover {
        background: #2e9a6f;
    }
}
</style>
