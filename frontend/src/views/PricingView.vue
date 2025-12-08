<template>
  <section class="py-12 px-4 md:px-8  min-h-screen">
    <h1 class="text-3xl font-bold text-center mb-8">Pricing & Tickets</h1>

    <div class="flex justify-center mb-8 space-x-4">
      <button
        :class="['px-4 py-2 rounded-lg font-semibold', activeTab === 'tickets' ? 'bg-green-600 text-white' : 'bg-white border']"
        @click="activeTab = 'tickets'"
      >
        Tickets
      </button>
      <button
        :class="['px-4 py-2 rounded-lg font-semibold', activeTab === 'reservations' ? 'bg-green-600 text-white' : 'bg-white border']"
        @click="activeTab = 'reservations'"
      >
        Reservations
      </button>
    </div>

    <div v-if="activeTab === 'tickets'">
      <table class="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-green-100 text-left">
          <tr>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Description</th>
            <th class="px-4 py-2">Price (PLN)</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in ticketStore.ticketTypes" :key="ticket.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-2">{{ ticket.name }}</td>
            <td class="px-4 py-2">{{ ticket.description || '-' }}</td>
            <td class="px-4 py-2 font-bold">{{ ticket.price }}</td>

          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'reservations'">
      <table class="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden mt-4">
        <thead class="bg-green-100 text-left">
          <tr>
            <th class="px-4 py-2">Event Type</th>
            <th class="px-4 py-2">Variants</th>
            <th class="px-4 py-2">Add-Ons</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="type in optionTypesStore.optionTypes" :key="type.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-2 font-semibold">{{ type.name }}</td>
            <td class="px-4 py-2">
              <ul class="space-y-1">
                <li v-for="variant in variantsByType(type.id)" :key="variant.id">
                  {{ variant.name }} – <span class="font-bold">{{ variant.price }} PLN</span> / <span class="text-green-600 font-extralight">{{ variant.pricing_type }}</span>
                </li>
                <li v-if="variantsByType(type.id).length === 0">No variants</li>
              </ul>
            </td>
            <td class="px-4 py-2">
              <ul class="space-y-1">
                <li v-for="addOn in addOnsByType(type.id)" :key="addOn.id">
                  {{ addOn.name }} – <span class="font-bold">{{ addOn.price }} PLN</span> / <span class="text-green-600 font-extralight">{{ addOn.pricing_type }}</span>
                </li>
                <li v-if="addOnsByType(type.id).length === 0">No add-ons</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTicketTypeStore } from '@/stores/ticketTypesStore'
import { useReservationOptionTypesStore } from "@/stores/reservationOptionTypesStore";
import { useOptionTypeVariantsStore } from "@/stores/optionTypeVariantStore";
import { useReservationOptionAddOnsStore } from "@/stores/addOnsStore";

const ticketStore = useTicketTypeStore()
const optionTypesStore = useReservationOptionTypesStore();
const variantsStore = useOptionTypeVariantsStore();
const addOnsStore = useReservationOptionAddOnsStore();

const activeTab = ref<'tickets' | 'reservations'>('tickets')

onMounted(async () => {
  await ticketStore.fetchTicketTypes()
  await optionTypesStore.fetchOptionTypes()
  await variantsStore.fetchVariants()
  await addOnsStore.fetchAddOns()
})

const variantsByType = (typeId: number) =>
  variantsStore.variants.filter(v => v.reservation_option_type_id === typeId)

const addOnsByType = (typeId: number) =>
  addOnsStore.addOns.filter(a => a.reservation_option_type_id === typeId)
</script>

<style scoped>
tbody tr:hover {
  transition: background-color 0.2s;
}
</style>
