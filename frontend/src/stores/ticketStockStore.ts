import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface TicketStock {
  id?: number;
  ticket_type_id: number;
  date: string;
  total_quantity: number;
  sold_quantity: number;
  modified_by?: string | null;
  updated_at?: string;
  stock_data?: Record<string, any>; // optional for getter
}

export const useTicketStockStore = defineStore("ticketStock", () => {
  const stocks = ref<TicketStock[]>([]);
  const stock = ref<TicketStock | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const stockForSelectedDate = computed(() => {
    if (!stock.value) return {};
    return stock.value.stock_data || {};
  });

  const fetchStocks = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/ticket-stock");
      if (!res.ok) throw new Error("Failed to fetch ticket stocks");
      stocks.value = await res.json();
    } catch (err: any) {
      error.value = err.message || "Error fetching ticket stocks";
    } finally {
      loading.value = false;
    }
  };

  const fetchStockByDate = async (date: string) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/ticket-stock/by-date?date=${date}`);
      if (!res.ok) throw new Error("Failed to load stock");
      stock.value = await res.json();
    } catch (err: any) {
      error.value = err.message || "Error loading stock";
    } finally {
      loading.value = false;
    }
  };

  const createStock = async (newStock: Omit<TicketStock, "id" | "updated_at">) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/ticket-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStock),
      });
      if (!res.ok) throw new Error("Failed to create stock");
      const data = await res.json();
      stocks.value.push(data);
      return data;
    } catch (err: any) {
      error.value = err.message || "Error creating stock";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const upsertStock = async (upsertData: Omit<TicketStock, "id" | "updated_at">) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch("/api/ticket-stock/upsert", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(upsertData),
      });
      if (!res.ok) throw new Error("Failed to save stock");

      const data = await res.json();
      const index = stocks.value.findIndex(
        (s) =>
          s.date.slice(0, 10) === data.date &&
          s.ticket_type_id === data.ticket_type_id
      );

      if (index !== -1) stocks.value[index] = data;
      else stocks.value.push(data);

      return data;
    } catch (err: any) {
      error.value = err.message || "Error upserting stock";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateStock = async (id: number, updatedData: Partial<TicketStock>) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/ticket-stock/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update stock");

      const data = await res.json();
      const index = stocks.value.findIndex((s) => s.id === id);
      if (index !== -1) stocks.value[index] = data;
      return data;
    } catch (err: any) {
      error.value = err.message || "Error updating stock";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateSoldQuantityForDate = async (date: string, increment: number) => {
    try {
      const res = await apiFetch("/api/ticket-stock/update-sold", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, increment }),
      });
      if (!res.ok) throw new Error("Failed to update sold quantity");

      const updated = await res.json();
      const index = stocks.value.findIndex(
        (s) => s.date.slice(0, 10) === updated.date
      );
      if (index !== -1) stocks.value[index] = updated;
      return updated;
    } catch (err: any) {
      error.value = err.message || "Error updating sold quantity";
      return null;
    }
  };

  const deleteStock = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await apiFetch(`/api/ticket-stock/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete stock");

      stocks.value = stocks.value.filter((s) => s.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.message || "Error deleting stock";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    stocks,
    stock,
    loading,
    error,
    stockForSelectedDate,
    fetchStocks,
    fetchStockByDate,
    createStock,
    upsertStock,
    updateStock,
    updateSoldQuantityForDate,
    deleteStock,
  };
});

