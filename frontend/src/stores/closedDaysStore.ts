import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";

export interface ClosedDay {
  id?: number;
  date: string;         // YYYY-MM-DD
  reason: string;
  created_by: number;
}

interface ClosedDayState {
  closedDays: ClosedDay[];
  loading: boolean;
  error: string | null;
}

export const useClosedDaysStore = defineStore("closedDays", {
  state: (): ClosedDayState => ({
    closedDays: [],
    loading: false,
    error: null,
  }),

  getters: {
 byDate: (state) => {
    const map: Record<string, ClosedDay[]> = {};
    const pad = (n: number) => String(n).padStart(2,'0');
    state.closedDays.forEach(d => {
      // Strip the time, convert to local YYYY-MM-DD
      const date = new Date(d.date);
      const key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      if (!map[key]) map[key] = [];
      map[key].push(d);
    });
    return map;
  }
},

  actions: {
    // ========== FETCH ALL ==========
    async fetchClosedDays() {
      this.loading = true;
      this.error = null;

      try {
        const res = await apiFetch("/api/closed-days");
        if (!res.ok) throw new Error("Failed to fetch closed days");

        this.closedDays = await res.json();
      } catch (err: any) {
        this.error = err.message || "Error fetching closed days";
      } finally {
        this.loading = false;
      }
    },

    // ========== CREATE ==========
    async createClosedDay(payload: Omit<ClosedDay, "id">) {
      this.loading = true;
      this.error = null;

      try {
        const res = await apiFetch("/api/closed-days", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create closed day");

        const created = await res.json();
        this.closedDays.push(created);

        return created;
      } catch (err: any) {
        this.error = err.message || "Error creating closed day";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ========== UPDATE ==========
    async updateClosedDay(id: number, payload: Partial<ClosedDay>) {
      this.loading = true;
      this.error = null;

      try {
        const res = await apiFetch(`/api/closed-days/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update closed day");

        const updated = await res.json();

        const index = this.closedDays.findIndex((d) => d.id === id);
        if (index !== -1) this.closedDays[index] = updated;

        return updated;
      } catch (err: any) {
        this.error = err.message || "Error updating closed day";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ========== DELETE ==========
    async deleteClosedDay(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const res = await apiFetch(`/api/closed-days/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete closed day");

        this.closedDays = this.closedDays.filter((d) => d.id !== id);
      } catch (err: any) {
        this.error = err.message || "Error deleting closed day";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
