import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface ClosedDay {
  id?: number;
  date: string;
  reason: string;
  created_by: number;
}

export const useClosedDaysStore = defineStore(
  "closedDays",
  () => {
    const closedDays = ref<ClosedDay[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const byDate = computed(() => {
      const map: Record<string, ClosedDay[]> = {};
      const pad = (n: number) => String(n).padStart(2, "0");

      closedDays.value.forEach((d) => {
        const date = new Date(d.date);
        const key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )}`;
        if (!map[key]) map[key] = [];
        map[key].push(d);
      });

      return map;
    });

    const fetchClosedDays = async () => {
      loading.value = true;
      error.value = null;

      try {
        const res = await apiFetch("/api/closed-days");
        if (!res.ok) throw new Error("Failed to fetch closed days");

        closedDays.value = await res.json();
      } catch (err: any) {
        error.value = err.message || "Error fetching closed days";
      } finally {
        loading.value = false;
      }
    };

    const createClosedDay = async (payload: Omit<ClosedDay, "id">) => {
      loading.value = true;
      error.value = null;

      try {
        const res = await apiFetch("/api/closed-days", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create closed day");

        const created = await res.json();
        closedDays.value.push(created);

        return created;
      } catch (err: any) {
        error.value = err.message || "Error creating closed day";
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const updateClosedDay = async (id: number, payload: Partial<ClosedDay>) => {
      loading.value = true;
      error.value = null;

      try {
        const res = await apiFetch(`/api/closed-days/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update closed day");

        const updated = await res.json();
        const index = closedDays.value.findIndex((d) => d.id === id);
        if (index !== -1) closedDays.value[index] = updated;

        return updated;
      } catch (err: any) {
        error.value = err.message || "Error updating closed day";
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const deleteClosedDay = async (id: number) => {
      loading.value = true;
      error.value = null;

      try {
        const res = await apiFetch(`/api/closed-days/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete closed day");

        closedDays.value = closedDays.value.filter((d) => d.id !== id);
      } catch (err: any) {
        error.value = err.message || "Error deleting closed day";
        throw err;
      } finally {
        loading.value = false;
      }
    };

    return {
      closedDays,
      loading,
      error,
      byDate,
      fetchClosedDays,
      createClosedDay,
      updateClosedDay,
      deleteClosedDay,
    };
  }
);

