import { defineStore } from "pinia";

export interface OpeningHour {
  id?: number;
  day_of_week: string; // e.g., "monday"
  open_time: string;   // "09:00"
  close_time: string;  // "17:00"
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface OpeningHourState {
  openingHours: OpeningHour[];
  loading: boolean;
  error: string | null;
}

export const useOpeningHoursStore = defineStore("openingHours", {
  state: (): OpeningHourState => ({
    openingHours: [],
    loading: false,
    error: null,
  }),

  getters: {
    byDay: (state) => {
      const map: Record<string, OpeningHour> = {};
      state.openingHours.forEach((h) => {
        map[h.day_of_week] = h;
      });
      return map;
    },
  },

  actions: {
    // FETCH ALL
    async fetchOpeningHours() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch("/api/opening-hours");
        if (!res.ok) throw new Error("Failed to fetch opening hours");
        this.openingHours = await res.json();
      } catch (err: any) {
        this.error = err.message || "Error fetching opening hours";
      } finally {
        this.loading = false;
      }
    },

    // CREATE
    async createOpeningHour(payload: Omit<OpeningHour, "id" | "created_at" | "updated_at">) {
      try {
        const res = await fetch("/api/opening-hours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create opening hour");
        const newHour = await res.json();
        this.openingHours.push(newHour);
      } catch (err: any) {
        this.error = err.message || "Error creating opening hour";
      }
    },

    // UPDATE
    async updateOpeningHour(id: number, payload: Partial<OpeningHour>) {
      try {
        const res = await fetch(`/api/opening-hours/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update opening hour");
        const updated = await res.json();
        const idx = this.openingHours.findIndex((h) => h.id === id);
        if (idx !== -1) this.openingHours[idx] = updated;
      } catch (err: any) {
        this.error = err.message || "Error updating opening hour";
      }
    },

    // DELETE
    async deleteOpeningHour(id: number) {
      try {
        const res = await fetch(`/api/opening-hours/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete opening hour");
        this.openingHours = this.openingHours.filter((h) => h.id !== id);
      } catch (err: any) {
        this.error = err.message || "Error deleting opening hour";
      }
    },
  },
});
