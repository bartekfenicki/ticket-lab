import { apiFetch } from "@/utils/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface OptionTypeVariant {
  id: number;
  reservation_option_type_id: number;
  name: string;
  price: number;
  pricing_type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useOptionTypeVariantsStore = defineStore(
  "optionTypeVariantsStore",
  () => {
    const variants = ref<OptionTypeVariant[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Fetch all variants
    const fetchVariants = async () => {
      loading.value = true;
      error.value = null;
      try {
        const res = await apiFetch("/api/option-type-variants");
        if (!res.ok) throw new Error("Failed to fetch variants");
        variants.value = await res.json();
      } catch (err: any) {
        error.value = err.message || "Error fetching variants";
      } finally {
        loading.value = false;
      }
    };

    // Fetch variants for a specific reservation option type
    const fetchVariantsByOptionType = async (optionTypeId: number) => {
      loading.value = true;
      error.value = null;
      try {
        const res = await apiFetch(`/api/option-type-variants/option-type/${optionTypeId}`);
        if (!res.ok) throw new Error("Failed to fetch variants for option type");
        variants.value = await res.json();
      } catch (err: any) {
        error.value = err.message || "Error fetching variants";
      } finally {
        loading.value = false;
      }
    };

    // Create a variant
    const createVariant = async (data: Omit<OptionTypeVariant, "id" | "created_at" | "updated_at">) => {
      loading.value = true;
      try {
        const res = await apiFetch("/api/option-type-variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create variant");
        const newVariant = await res.json();
        variants.value.push(newVariant);
        return newVariant;
      } finally {
        loading.value = false;
      }
    };

    // Update a variant
    const updateVariant = async (id: number, data: Partial<OptionTypeVariant>) => {
      loading.value = true;
      try {
        const res = await apiFetch(`/api/option-type-variants/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update variant");
        const updated = await res.json();
        const index = variants.value.findIndex(v => v.id === id);
        if (index !== -1) variants.value[index] = updated;
        return updated;
      } finally {
        loading.value = false;
      }
    };

    // Delete a variant
    const deleteVariant = async (id: number) => {
      loading.value = true;
      try {
        const res = await apiFetch(`/api/option-type-variants/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete variant");
        variants.value = variants.value.filter(v => v.id !== id);
      } finally {
        loading.value = false;
      }
    };

    return {
      variants,
      loading,
      error,
      fetchVariants,
      fetchVariantsByOptionType,
      createVariant,
      updateVariant,
      deleteVariant,
    };
  }
);
