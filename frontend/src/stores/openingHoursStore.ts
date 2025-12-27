import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface OpeningHour {
  id?: number;
  day_of_week: string;
  open_time: string;
  close_time: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useOpeningHoursStore = defineStore("openingHours", () => {

  const openingHours = ref<OpeningHour[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const byDay = computed(() => {
    const map: Record<string, OpeningHour> = {};
    openingHours.value.forEach((h) => {
      map[h.day_of_week] = h;
    });
    return map;
  });

  const fetchOpeningHours = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/opening-hours");
      if (!res.ok) throw new Error("Failed to fetch opening hours");
      openingHours.value = await res.json();
    } catch (err: any) {
      error.value = err.message || "Error fetching opening hours";
    } finally {
      loading.value = false;
    }
  };

  const createOpeningHour = async (
    payload: Omit<OpeningHour, "id" | "created_at" | "updated_at">
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/opening-hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create opening hour");

      const newHour = await res.json();
      openingHours.value.push(newHour);
      return newHour;
    } catch (err: any) {
      error.value = err.message || "Error creating opening hour";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateOpeningHour = async (id: number, payload: Partial<OpeningHour>) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/opening-hours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update opening hour");

      const updated = await res.json();
      const idx = openingHours.value.findIndex((h) => h.id === id);
      if (idx !== -1) openingHours.value[idx] = updated;

      return updated;
    } catch (err: any) {
      error.value = err.message || "Error updating opening hour";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteOpeningHour = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/opening-hours/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete opening hour");

      openingHours.value = openingHours.value.filter((h) => h.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.message || "Error deleting opening hour";
      return false;
    } finally {
      loading.value = false;
    }
  };
  return {
    openingHours,
    loading,
    error,
    byDay,
    fetchOpeningHours,
    createOpeningHour,
    updateOpeningHour,
    deleteOpeningHour,
  };
});
