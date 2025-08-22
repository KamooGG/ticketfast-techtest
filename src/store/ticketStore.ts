import { defineStore } from "pinia";

// Define los posibles estados y prioridades de un ticket
export type TicketStatus = "Abierto" | "En Progreso" | "Cerrado";
export type TicketPriority = "Alta" | "Media" | "Baja";

// Interfaz que representa la estructura de un ticket
export interface Ticket {
    id: number;                // Identificador único del ticket
    title: string;             // Título del ticket
    description: string;       // Descripción del ticket
    status: TicketStatus;      // Estado actual del ticket
    priority: TicketPriority;  // Prioridad del ticket
    createdAt: string;         // Fecha de creación (ISO)
    updatedAt: string;         // Fecha de última actualización (ISO)
    assignedTo?: string;       // Persona asignada al ticket
}

// Clave para almacenar los tickets en localStorage
const STORAGE_KEY = "ticketmanager.tickets.v1";

// Carga los tickets desde localStorage
function load(): Ticket[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Ticket[]) : [];
    } catch {
        return [];
    }
}

// Guarda los tickets en localStorage
function save(data: Ticket[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Define el store de tickets usando Pinia
export const useTicketStore = defineStore("tickets", {
    // Estado inicial: lista de tickets vacía
    state: () => ({
        tickets: [] as Ticket[],
    }),
    actions: {
        // Carga los tickets desde el almacenamiento local
        loadFromStorage() {
            this.tickets = load();
        },
        // Guarda los tickets en el almacenamiento local
        saveToStorage() {
            save(this.tickets);
        },

        // Agrega un nuevo ticket al store
        addTicket(ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) {
            const now = new Date().toISOString();
            const newTicket: Ticket = {
                ...ticket,
                id: Date.now(),        // Usa timestamp como id único
                createdAt: now,
                updatedAt: now,
            };
            this.tickets.push(newTicket);
            this.saveToStorage();
        },

        // Actualiza un ticket existente por id
        updateTicket(id: number, updates: Partial<Ticket>) {
            const i = this.tickets.findIndex((t) => t.id === id);
            if (i !== -1) {
                this.tickets[i] = {
                    ...this.tickets[i],
                    ...updates,
                    updatedAt: new Date().toISOString(), // Actualiza la fecha
                };
                this.saveToStorage();
            }
        },

        // Elimina un ticket por id
        deleteTicket(id: number) {
            this.tickets = this.tickets.filter((t) => t.id !== id);
            this.saveToStorage();
        },
    },
});
