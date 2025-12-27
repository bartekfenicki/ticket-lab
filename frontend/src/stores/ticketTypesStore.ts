import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface TicketType {
  id?: number;
  name: string;
  price: number;
  description: string;
  is_special_event: boolean;
  active: boolean;
}

export const useTicketTypeStore = defineStore("ticketType", () => {

  const ticketTypes = ref<TicketType[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTicketTypes = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/ticket-types");
      if (!res.ok) throw new Error("Failed to fetch ticket types");
      ticketTypes.value = await res.json();
    } catch (err: any) {
      error.value = err.message || "Error fetching ticket types";
    } finally {
      loading.value = false;
    }
  };

  const createTicketType = async (ticket: Omit<TicketType, "id">) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/ticket-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });
      if (!res.ok) throw new Error("Failed to create ticket type");

      const newTicket = await res.json();
      ticketTypes.value.push(newTicket);
      return newTicket;
    } catch (err: any) {
      error.value = err.message || "Error creating ticket type";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateTicketType = async (id: number, updatedData: Partial<TicketType>) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/ticket-types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update ticket type");

      const updatedTicket = await res.json();
      const index = ticketTypes.value.findIndex((t) => t.id === id);
      if (index !== -1) ticketTypes.value[index] = updatedTicket;
      return updatedTicket;
    } catch (err: any) {
      error.value = err.message || "Error updating ticket type";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteTicketType = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/ticket-types/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete ticket type");

      ticketTypes.value = ticketTypes.value.filter((t) => t.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.message || "Error deleting ticket type";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    ticketTypes,
    loading,
    error,
    fetchTicketTypes,
    createTicketType,
    updateTicketType,
    deleteTicketType,
  };
});
