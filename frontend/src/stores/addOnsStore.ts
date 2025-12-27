import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface ReservationOptionAddOn {
  id: number;
  reservation_option_type_id: number;
  name: string;
  description: string;
  price: number;
  pricing_type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useReservationOptionAddOnsStore = defineStore(
  "reservationOptionAddOnsStore",
  () => {
    const addOns = ref<ReservationOptionAddOn[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchAddOns = async () => {
      loading.value = true;
      error.value = null;
      try {
        const res = await apiFetch("/api/addons");
        if (!res.ok) throw new Error("Failed to fetch add-ons");
        addOns.value = await res.json();
      } catch (err: any) {
        error.value = err.message || "Error fetching add-ons";
      } finally {
        loading.value = false;
      }
    };

    const fetchAddOnsByOptionType = async (optionTypeId: number) => {
      loading.value = true;
      error.value = null;
      try {
        const res = await apiFetch(`/api/addons/option-type/${optionTypeId}`);
        if (!res.ok) throw new Error("Failed to fetch add-ons for option type");
        addOns.value = await res.json();
      } catch (err: any) {
        error.value = err.message || "Error fetching add-ons";
      } finally {
        loading.value = false;
      }
    };

    const createAddOn = async (data: Omit<ReservationOptionAddOn, "id" | "created_at" | "updated_at">) => {
      loading.value = true;
      try {
        const res = await apiFetch("/api/addons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create add-on");
        const newAddOn = await res.json();
        addOns.value.push(newAddOn);
        return newAddOn;
      } finally {
        loading.value = false;
      }
    };

    const updateAddOn = async (id: number, data: Partial<ReservationOptionAddOn>) => {
      loading.value = true;
      try {
        const res = await apiFetch(`/api/addons/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update add-on");
        const updated = await res.json();
        const index = addOns.value.findIndex(a => a.id === id);
        if (index !== -1) addOns.value[index] = updated;
        return updated;
      } finally {
        loading.value = false;
      }
    };

    const deleteAddOn = async (id: number) => {
      loading.value = true;
      try {
        const res = await apiFetch(`/api/reservation-option-addons/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete add-on");
        addOns.value = addOns.value.filter(a => a.id !== id);
      } finally {
        loading.value = false;
      }
    };

    return {
      addOns,
      loading,
      error,
      fetchAddOns,
      fetchAddOnsByOptionType,
      createAddOn,
      updateAddOn,
      deleteAddOn,
    };
  }
);
