import { defineStore } from "pinia";

export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: "Abierto" | "En Progreso" | "Cerrado";
    priority: "Alta" | "Media" | "Baja";
    createdAt: string;
    updatedAt: string;
    assignedTo: string | null;
}

const STORAGE_KEY = "tickets";

export const useTicketStore = defineStore("tickets", {
    state: () => ({
        tickets: [] as Ticket[],
    }),
    actions: {
        loadFromStorage() {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                this.tickets = JSON.parse(data);
            }
        },
        saveToStorage() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tickets));
        },
        addTicket(ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) {
            const newTicket: Ticket = {
                ...ticket,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.tickets.push(newTicket);
            this.saveToStorage();
        },
        updateTicket(id: number, updates: Partial<Ticket>) {
            const idx = this.tickets.findIndex((t) => t.id === id);
            if (idx !== -1) {
                this.tickets[idx] = {
                    ...this.tickets[idx],
                    ...updates,
                    updatedAt: new Date().toISOString(),
                };
                this.saveToStorage();
            }
        },
        deleteTicket(id: number) {
            this.tickets = this.tickets.filter((t) => t.id !== id);
            this.saveToStorage();
        },
    },
});
