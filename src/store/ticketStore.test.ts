import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import { useTicketStore } from "./ticketStore";

describe("ticket store", () => {
    let store: ReturnType<typeof useTicketStore>;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2023-01-01T00:00:00Z"));

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

        const pinia = createPinia();
        /**
         * Deletes all the key-value pairs in the localStorage.
         */
        setActivePinia(pinia);
        mount({ template: "<div />" }, { global: { plugins: [pinia] } });
        store = useTicketStore();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

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

    it("updates a ticket", () => {
        store.addTicket({
            title: "Ticket",
            description: "Desc",
            status: "Abierto",
            priority: "Alta",
        });
        const id = store.tickets[0].id;
        const originalUpdatedAt = store.tickets[0].updatedAt;

        vi.setSystemTime(new Date("2023-01-02T00:00:00Z"));
        store.updateTicket(id, { title: "Actualizado", status: "En Progreso" });

        expect(store.tickets[0]).toMatchObject({
            id,
            title: "Actualizado",
            status: "En Progreso",
        });
        expect(store.tickets[0].updatedAt).not.toBe(originalUpdatedAt);
    });

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
