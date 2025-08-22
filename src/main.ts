// Importa la función para crear la app de Vue
import { createApp } from "vue";
// Importa Pinia para el manejo de estado global
import { createPinia } from "pinia";
// Importa el componente raíz de la aplicación
import App from "./App.vue";
// Importa el router para la navegación entre vistas
import router from "./router";
// Importa los estilos globales de la aplicación
import '@/styles/main.scss'

// Crea la instancia principal de la aplicación Vue
const app = createApp(App);
// Crea la instancia de Pinia (store global)
const pinia = createPinia();

// Registra Pinia y el router en la aplicación
app.use(pinia);
app.use(router);

// Carga los tickets desde localStorage al iniciar la app
import { useTicketStore } from "./store/ticketStore";
const store = useTicketStore(pinia);
store.loadFromStorage();

// Monta la aplicación en el elemento con id 'app' en el HTML
app.mount("#app");
