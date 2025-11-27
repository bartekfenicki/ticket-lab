<template>
  <div class="p-6 bg-white rounded-xl shadow-md space-y-6">
    <!-- Tabs -->
    <div class="flex border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 font-medium transition-colors',
          activeTab === tab.id
            ? 'border-b-2 border-indigo-600 text-indigo-600'
            : 'text-gray-600 hover:text-indigo-600'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-4">
      <ReservationOptionTypesManager v-if="activeTab === 'optionTypes'" />
      <ReservationOptionTypeVariantsManager v-if="activeTab === 'variants'" />
      <AddOnsManager v-if="activeTab === 'addons'"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReservationOptionTypesManager from '../reservations/reservationOptionTypesManager.vue'
import ReservationOptionTypeVariantsManager from '../reservations/optionTypeVariantsManager.vue'
import AddOnsManager from '../reservations/addOnsManager.vue'

const tabs = [
  { id: 'optionTypes', name: 'Reservation Option Types' },
  { id: 'variants', name: 'Option Type Variants' },
  { id: 'addons', name: 'Add Ons' },
]

const activeTab = ref('optionTypes')
</script>

