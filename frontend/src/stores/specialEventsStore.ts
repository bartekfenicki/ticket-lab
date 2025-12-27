import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface SpecialEvent {
  id?: number;
  title: string;
  description: string;
  date: string; // ISO string
  ticket_type_id: number;
  max_tickets: number;
  active: boolean;
}

export const useSpecialEventsStore = defineStore("specialEvents", () => {
  const events = ref<SpecialEvent[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/special-events");
      if (!res.ok) throw new Error("Failed to fetch events");

      const data = await res.json();
      events.value = data.map((e: any) => ({
        ...e,
        date: e.date.split("T")[0],
      }));
    } catch (err: any) {
      error.value = err.message || "Error fetching events";
    } finally {
      loading.value = false;
    }
  };

  const createEvent = async (eventData: Omit<SpecialEvent, "id">) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/special-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (!res.ok) throw new Error("Failed to create event");

      const newEvent = await res.json();
      events.value.push(newEvent);
      return newEvent;
    } catch (err: any) {
      error.value = err.message || "Error creating event";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateEvent = async (id: number, updatedData: Partial<SpecialEvent>) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/special-events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update event");

      const updatedEvent = await res.json();
      const index = events.value.findIndex((e) => e.id === id);
      if (index !== -1) events.value[index] = updatedEvent;

      return updatedEvent;
    } catch (err: any) {
      error.value = err.message || "Error updating event";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteEvent = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/special-events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");

      events.value = events.value.filter((e) => e.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.message || "Error deleting event";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
});
