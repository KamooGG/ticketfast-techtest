import { defineStore } from "pinia";

export type TicketStatus = "Abierto" | "En Progreso" | "Cerrado";
export type TicketPriority = "Alta" | "Media" | "Baja";

export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string;
}

const STORAGE_KEY = "ticketfast.tickets.v1";

function load(): Ticket[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Ticket[]) : [];
    } catch {
        return [];
    }
}
function save(data: Ticket[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const useTicketStore = defineStore("tickets", {
    state: () => ({
        tickets: [] as Ticket[],
    }),
    actions: {
        loadFromStorage() {
            this.tickets = load();
        },
        saveToStorage() {
            save(this.tickets);
        },

        addTicket(ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) {
            const now = new Date().toISOString();
            const newTicket: Ticket = {
                ...ticket,
                id: Date.now(),
                createdAt: now,
                updatedAt: now,
            };
            this.tickets.push(newTicket);
            this.saveToStorage();
        },

        updateTicket(id: number, updates: Partial<Ticket>) {
            const i = this.tickets.findIndex((t) => t.id === id);
            if (i !== -1) {
                this.tickets[i] = {
                    ...this.tickets[i],
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
