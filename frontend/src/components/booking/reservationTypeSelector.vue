<template>
  <div>
    <!-- Reservation Option Types -->
    <h2 class="text-2xl text-green-700 font-semibold mb-4">Choose a Reservation Type</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div
        v-for="type in optionTypesStore.optionTypes"
        :key="type.id"
        @click="selectOptionType(type)"
        :class="[
          'p-4 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl transition',
          selectedOptionType?.id === type.id ? 'border-2 border-green-600' : ''
        ]"
      >
        <h3 class="text-xl font-bold">{{ type.name }}</h3>
        <p class="text-gray-600 mt-2">{{ type.description }}</p>
      </div>
    </div>

    <div v-if="selectedOptionType">
      <!-- People Count -->
      <div class="mb-4">
        <label class="block text-green-700 font-medium mb-1">Number of People</label>
        <input type="number" min="1" v-model.number="numPeople" class="border rounded-lg p-2 w-24"/>
      </div>

      <!-- Variants -->
      <div v-if="variantsStore.variants.length > 0" class="mb-6">
        <h3 class="text-xl font-semibold text-green-700 mb-2">Choose a Variant</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="variant in variantsStore.variants"
            :key="variant.id"
            @click="selectedVariant = variant"
            :class="[
              'p-3 bg-white rounded-xl shadow cursor-pointer hover:shadow-lg transition',
              selectedVariant?.id === variant.id ? 'border-2 border-green-600' : ''
            ]"
          >
            <h4 class="font-bold">{{ variant.name }}</h4>
            <p class="text-gray-600">{{ variant.description }}</p>
            <p class="mt-1 font-semibold text-green-600">{{ displayPrice(variant.price, variant.pricing_type) }}</p>
          </div>
        </div>
      </div>

      <!-- Add-Ons -->
      <div v-if="addOnsStore.addOns.length > 0" class="mb-6">
        <h3 class="text-xl text-green-700 font-semibold mb-2">Add-Ons</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="addOn in addOnsStore.addOns"
            :key="addOn.id"
            class="p-3 bg-white rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h4 class="font-bold">{{ addOn.name }}</h4>
              <p class="text-gray-600 text-sm">{{ addOn.description }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="font-semibold text-green-600">{{ displayPrice(addOn.price, addOn.pricing_type) }}</span>
              <input type="checkbox" v-model="selectedAddOnIds" :value="addOn.id" class="rounded"/>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-gray-50 p-4 rounded-xl shadow-md mb-4">
        <h3 class="text-xl font-semibold mb-2">Summary</h3>
        <p><strong>Reservation Type:</strong> {{ selectedOptionType.name }}</p>
        <p v-if="selectedVariant"><strong>Variant:</strong> {{ selectedVariant.name }} ({{ displayPrice(selectedVariant.price, selectedVariant.pricing_type) }})</p>
        <p v-if="selectedAddOns.length > 0"><strong>Add-Ons:</strong> {{ selectedAddOns.map(a => a.name).join(', ') }}</p>
        <p><strong>Number of People:</strong> {{ numPeople }}</p>
        <p class="mt-2 text-lg font-bold text-indigo-600">Total: {{ totalPrice }} PLN</p>
      </div>

      <button
        @click="proceed"
        class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Proceed to Personal Info
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useReservationOptionTypesStore } from "@/stores/reservationOptionTypesStore";
import { useOptionTypeVariantsStore } from "@/stores/optionTypeVariantStore";
import { useReservationOptionAddOnsStore } from "@/stores/addOnsStore";




const optionTypesStore = useReservationOptionTypesStore();
const variantsStore = useOptionTypeVariantsStore();
const addOnsStore = useReservationOptionAddOnsStore();

const selectedOptionType = ref<any>(null);
const selectedVariant = ref<any>(null);
const selectedAddOnIds = ref<number[]>([]);
const numPeople = ref(1);

onMounted(async () => {
  await optionTypesStore.fetchOptionTypes();
});

// Load variants and add-ons when an option type is selected
const selectOptionType = async (type: any) => {
  selectedOptionType.value = type;
  selectedVariant.value = null;
  selectedAddOnIds.value = [];

  await variantsStore.fetchVariantsByOptionType(type.id);
  await addOnsStore.fetchAddOnsByOptionType(type.id);
};

// Computed selected add-ons
const selectedAddOns = computed(() => {
  return addOnsStore.addOns.filter(a => selectedAddOnIds.value.includes(a.id));
});

// Price calculation helper
const displayPrice = (price: number, pricingType: string) => {
  return pricingType === "per_person" ? `${price} PLN/person` : `${price} PLN`;
};

// Total price
const totalPrice = computed(() => {
  let total = 0;

  if (selectedVariant.value) {
    const variantPrice = Number(selectedVariant.value.price);
    total += selectedVariant.value.pricing_type === "per_person"
      ? variantPrice * numPeople.value
      : variantPrice;
  }

  selectedAddOns.value.forEach(a => {
    const addOnPrice = Number(a.price);
    total += a.pricing_type === "per_person"
      ? addOnPrice * numPeople.value
      : addOnPrice;
  });

  return total.toFixed(2); // optional, format to 2 decimals
});

// Proceed to personal info
const emit = defineEmits(["proceed"]);

const proceed = () => {
  emit("proceed", {
    reservation_option_type: selectedOptionType.value,
    variant: selectedVariant.value,
    addOns: selectedAddOns.value,
    numPeople: numPeople.value,
    totalPrice: totalPrice.value,
  });
};
</script>
