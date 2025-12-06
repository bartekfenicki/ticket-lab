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
      <ClosedDays v-if="activeTab === 'closedDays'"/>
      <OpeningHours v-if="activeTab === 'openingHours'"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ClosedDays from '../daysManagement/closedDays.vue'
import OpeningHours from '../daysManagement/openingHours.vue'

const tabs = [
  { id: 'closedDays', name: 'Closed Days' },
  { id: 'openingHours', name: 'Opening Hours' },
]

const activeTab = ref('closedDays')
</script>
