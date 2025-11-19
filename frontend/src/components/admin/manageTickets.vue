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
          activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-4">
      <TicketTypes v-if="activeTab === 'types'" />
      <TicketStock v-if="activeTab === 'stock'" />
      <SpecialEvents v-if="activeTab === 'event'"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TicketStock from '../tickets/ticketStock.vue'
import TicketTypes from '../tickets/ticketTypes.vue'
import SpecialEvents from '../tickets/specialEvents.vue'

const tabs = [
  { id: 'types', name: 'Ticket Types' },
  { id: 'stock', name: 'Ticket Stock' },
  { id: 'event', name: 'Special Events' },
]

const activeTab = ref('types')
</script>

