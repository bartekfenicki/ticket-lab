import { defineStore } from "pinia";

export interface TicketType {
  id?: number;
  name: string;
  price: number;
  description: string;
  is_special_event: boolean;
  active: boolean;
}

interface TicketTypeState {
  ticketTypes: TicketType[];
  loading: boolean;
  error: string | null;
}

export const useTicketTypeStore = defineStore("ticketType", {
  state: (): TicketTypeState => ({
    ticketTypes: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchTicketTypes() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch("/api/ticket-types");
        if (!res.ok) throw new Error("Failed to fetch ticket types");
        this.ticketTypes = await res.json();
      } catch (err: any) {
        this.error = err.message || "Error fetching ticket types";
      } finally {
        this.loading = false;
      }
    },

    async createTicketType(ticket: Omit<TicketType, "id">) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch("/api/ticket-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ticket),
        });
        if (!res.ok) throw new Error("Failed to create ticket type");
        const newTicket = await res.json();
        this.ticketTypes.push(newTicket);
        return newTicket;
      } catch (err: any) {
        this.error = err.message || "Error creating ticket type";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateTicketType(id: number, updatedData: Partial<TicketType>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`/api/ticket-types/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
        if (!res.ok) throw new Error("Failed to update ticket type");
        const updatedTicket = await res.json();
        const index = this.ticketTypes.findIndex(t => t.id === id);
        if (index !== -1) this.ticketTypes[index] = updatedTicket;
        return updatedTicket;
      } catch (err: any) {
        this.error = err.message || "Error updating ticket type";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteTicketType(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`/api/ticket-types/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete ticket type");
        this.ticketTypes = this.ticketTypes.filter(t => t.id !== id);
        return true;
      } catch (err: any) {
        this.error = err.message || "Error deleting ticket type";
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
