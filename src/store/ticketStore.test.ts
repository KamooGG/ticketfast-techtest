import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import { useTicketStore } from "./ticketStore";

// Grupo de pruebas para el store de tickets
describe("ticket store", () => {
    let store: ReturnType<typeof useTicketStore>;

    // Antes de cada prueba, configura el entorno de pruebas
    beforeEach(() => {
        // Usa temporizadores falsos para controlar la fecha/hora
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2023-01-01T00:00:00Z"));

        // Stub de localStorage en memoria para aislar las pruebas
        const storage: Record<string, string> = {};
        vi.stubGlobal("localStorage", {
            getItem: (key: string) => storage[key] ?? null,
            setItem: (key: string, value: string) => {
                storage[key] = value;
            },
            removeItem: (key: string) => {
                delete storage[key];
            },
            clear: () => {
                Object.keys(storage).forEach((k) => delete storage[k]);
            },
        });

        // Inicializa Pinia y el store para cada prueba
        const pinia = createPinia();
        /**
         * Elimina todos los pares clave-valor en el localStorage.
         */
        setActivePinia(pinia);
        mount({ template: "<div />" }, { global: { plugins: [pinia] } });
        store = useTicketStore();
    });

    // Después de cada prueba, restaura temporizadores y elimina stubs globales
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    // Prueba: agregar un ticket al store
    it("adds a ticket", () => {
        store.addTicket({
            title: "Nuevo Ticket",
            description: "Descripción",
            status: "Abierto",
            priority: "Alta",
        });

        expect(store.tickets).toHaveLength(1);
        expect(store.tickets[0]).toMatchObject({
            title: "Nuevo Ticket",
            description: "Descripción",
            status: "Abierto",
            priority: "Alta",
        });
    });

    // Prueba: actualizar un ticket existente
    it("updates a ticket", () => {
        store.addTicket({
            title: "Ticket",
            description: "Desc",
            status: "Abierto",
            priority: "Alta",
        });
        const id = store.tickets[0].id;
        const originalUpdatedAt = store.tickets[0].updatedAt;

        // Cambia la fecha/hora simulada antes de actualizar
        vi.setSystemTime(new Date("2023-01-02T00:00:00Z"));
        store.updateTicket(id, { title: "Actualizado", status: "En Progreso" });

        expect(store.tickets[0]).toMatchObject({
            id,
            title: "Actualizado",
            status: "En Progreso",
        });
        // Verifica que la fecha de actualización haya cambiado
        expect(store.tickets[0].updatedAt).not.toBe(originalUpdatedAt);
    });

    // Prueba: eliminar un ticket del store
    it("deletes a ticket", () => {
        store.addTicket({
            title: "Ticket",
            description: "Desc",
            status: "Abierto",
            priority: "Alta",
        });
        const id = store.tickets[0].id;
        store.deleteTicket(id);

        expect(store.tickets).toHaveLength(0);
    });
});
