import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface TicketItem {
  ticket_type_id: number;
  quantity: number;
  price_at_purchase: number;
  name: string;
}

export interface Ticket {
  id: number;
  email: string;
    phone?: string;
  full_name: string;
  other_names?: string;
  date: string;
  qr_token: string;
  payment_status: string;
  total_price: number;
  special_event_id?: number | null;
  used: boolean;
  created_at: string;
  items: TicketItem[];
}

export const useTicketStore = defineStore("ticketStore", () => {
  const tickets = ref<Ticket[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch tickets by email
  const fetchTicketsByEmail = async (email: string) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await apiFetch(`/api/tickets/by-email?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Failed to fetch tickets");
      tickets.value = await res.json();
    } catch (err: any) {
      error.value = err.message || "Error fetching tickets";
    } finally {
      loading.value = false;
    }
  };

  // Fetch a ticket by ID
  const fetchTicketById = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await apiFetch(`/api/tickets/${id}`);
      if (!res.ok) throw new Error("Failed to fetch ticket");
      const ticket: Ticket = await res.json();

      const index = tickets.value.findIndex(t => t.id === id);
      if (index >= 0) {
        tickets.value[index] = ticket;
      } else {
        tickets.value.push(ticket);
      }

      return ticket;
    } catch (err: any) {
      error.value = err.message || "Error fetching ticket";
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Fetch all tickets
  const fetchAllTickets = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await apiFetch("/api/tickets");
      if (!res.ok) throw new Error("Failed to fetch tickets");
      tickets.value = await res.json();
    } catch (err: any) {
      error.value = err.message || "Error fetching tickets";
    } finally {
      loading.value = false;
    }
  };

  // Create a new ticket
  const createTicket = async (ticketData: Omit<Ticket, "id" | "created_at" | "qr_token" | "used">) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await apiFetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      const newTicket: Ticket = await res.json();
      tickets.value.push(newTicket);
      return newTicket;
    } catch (err: any) {
      error.value = err.message || "Error creating ticket";
      return null;
    } finally {
      loading.value = false;
    }
  };

 const updateTicket = async (id: number, data: Partial<Ticket>) => {
  loading.value = true;
  error.value = null;

  try {
    const res = await apiFetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update ticket");

    const updated: Ticket = await res.json();

    tickets.value = tickets.value.map(t =>
      t.id === id ? { ...t, ...updated } : t
    );

    return updated;
  } catch (err: any) {
    error.value = err.message || "Error updating ticket";
    return null;
  } finally {
    loading.value = false;
  }
};

  return {
    tickets,
    loading,
    error,
    fetchTicketsByEmail,
    fetchTicketById, // <-- added here
    fetchAllTickets,
    createTicket,
    updateTicket
  };
});


