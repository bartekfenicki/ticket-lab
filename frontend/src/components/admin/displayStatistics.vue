
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
      <ReservationStats v-if="activeTab === 'reservations'"/>
      <TicketStats v-if="activeTab === 'tickets'"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReservationStats from '../reservations/reservationStats.vue'
import TicketStats from '../tickets/ticketStats.vue'

const tabs = [
  { id: 'reservations', name: 'Reservations' },
  { id: 'tickets', name: 'Tickets' },
]

const activeTab = ref('reservations')
</script>
