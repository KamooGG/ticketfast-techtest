import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

import { useTicketStore } from "./store/ticketStore";
const store = useTicketStore(pinia);
store.loadFromStorage();

app.mount("#app");
