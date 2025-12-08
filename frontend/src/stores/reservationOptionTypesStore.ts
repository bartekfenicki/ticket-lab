import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface ReservationOptionType {
  id: number;
  name: string;
  description: string;
  default_price: number;
  active: boolean;
}

export const useReservationOptionTypesStore = defineStore(
  "reservationOptionTypesStore",
  () => {
    const optionTypes = ref<ReservationOptionType[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // FETCH ALL
    const fetchOptionTypes = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await apiFetch("/api/reservation-option-types");
        if (!response.ok) throw new Error("Failed to fetch reservation option types");
        optionTypes.value = await response.json();
      } catch (err: any) {
        error.value = err.message || "Error fetching reservation option types";
      } finally {
        loading.value = false;
      }
    };

    // CREATE
    const createOptionType = async (data: Omit<ReservationOptionType, "id">) => {
      loading.value = true;
      error.value = null;
      try {
        const response = await apiFetch("/api/reservation-option-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create option type");

        const created = await response.json();
        optionTypes.value.push(created);
        return created;
      } catch (err: any) {
        error.value = err.message || "Error creating reservation option type";
      } finally {
        loading.value = false;
      }
    };

    // UPDATE
    const updateOptionType = async (id: number, data: Partial<ReservationOptionType>) => {
      loading.value = true;
      error.value = null;
      try {
        const response = await apiFetch(`/api/reservation-option-types/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update option type");

        const updated = await response.json();

        const index = optionTypes.value.findIndex((o) => o.id === id);
        if (index !== -1) optionTypes.value[index] = updated;

        return updated;
      } catch (err: any) {
        error.value = err.message || "Error updating reservation option type";
      } finally {
        loading.value = false;
      }
    };

    // DELETE
    const deleteOptionType = async (id: number) => {
      loading.value = true;
      error.value = null;
      try {
        const response = await apiFetch(`/api/reservation-option-types/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete option type");

        optionTypes.value = optionTypes.value.filter((type) => type.id !== id);
      } catch (err: any) {
        error.value = err.message || "Error deleting reservation option type";
      } finally {
        loading.value = false;
      }
    };

    return {
      optionTypes,
      loading,
      error,
      fetchOptionTypes,
      createOptionType,
      updateOptionType,
      deleteOptionType,
    };
  }
);
