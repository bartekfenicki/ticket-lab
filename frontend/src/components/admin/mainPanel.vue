<template>
  <div class="p-8 max-w-6xl mx-auto space-y-8">
    <!-- Title -->
    <h1 class=" text-2xl sm:text-3xl font-bold text-green-700 mb-6">
      Main Panel
    </h1>

    <!-- Today Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <!-- Today's Reservations -->
      <div
        class="bg-white p-6 shadow rounded-xl border cursor-pointer hover:shadow-lg transition"
        @click="goToTab('reservations')"
      >
        <h3 class="font-semibold text-gray-600 mb-2">Reservations Today</h3>
        <p class="text-2xl font-bold text-yellow-600">{{ todaysReservations.length }}</p>
        <p class="text-gray-500 text-sm">{{ todaysReservations.length < 3 ? 'Few reservations today' : 'Keep track of your reservations' }}</p>
      </div>

      <!-- Today's Tickets -->
      <div
        class="bg-white p-6 shadow rounded-xl border cursor-pointer hover:shadow-lg transition"
        @click="goToTab('tickets')"
      >
        <h3 class="font-semibold text-gray-600 mb-2">Tickets Sold Today</h3>
        <p class="text-2xl font-bold text-green-600">{{ todaysTickets.length }}</p>
        <p class="text-gray-500 text-sm">{{ totalTicketRevenue }} PLN Revenue</p>
      </div>

      <!-- Today’s Sales Chart -->
      <div
        class="bg-white p-6 shadow rounded-xl border cursor-pointer hover:shadow-lg transition"
        @click="goToTab('statistics')"
      >
        <h3 class="font-semibold text-gray-600 mb-2">Today’s Revenue</h3>
        <p class="text-2xl font-bold text-orange-800">{{ todaysRevenue }} PLN</p>
        <p class="text-gray-500 text-sm">Track your daily sales</p>
      </div>
    </div>

    <!-- Upcoming Reservations -->
    <div class="bg-white p-6 shadow rounded-xl border">
      <h2 class="text-lg font-bold mb-4 text-gray-700">Upcoming Reservations</h2>
      <ul class="space-y-3">
        <li
          v-for="res in upcomingReservations"
          :key="res.id"
          class="flex justify-between items-center p-3 border border-yellow-300 rounded-lg bg-yellow-50"
        >
          <div>
            <p class="font-semibold text-yellow-700">{{ res.title }}</p>
            <p class="text-gray-500 text-sm">{{ formatDate(res.date) }} {{ formatTime(res.date) }}</p>
          </div>
          <button
            class="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            @click="goToTab('reservations')"
          >
            View
          </button>
        </li>
        <li v-if="upcomingReservations.length === 0" class="text-gray-400 text-sm">No upcoming reservations</li>
      </ul>
    </div>

    <!-- Upcoming Tickets -->
    <div class="bg-white p-6 shadow rounded-xl border">
      <h2 class="text-lg font-bold mb-4 text-gray-700">Upcoming Tickets</h2>
      <ul class="space-y-3">
        <li
          v-for="ticket in upcomingTickets"
          :key="ticket.id"
          class="flex justify-between items-center p-3 border border-green-300 rounded-lg bg-green-50"
        >
          <div>
            <p class="font-semibold text-green-700">{{ ticket.full_name }}</p>
            <p class="text-gray-500 text-sm">{{ formatDate(ticket.date) }} - {{ ticket.total_price }} PLN</p>
          </div>
          <button
            class="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            @click="goToTab('tickets')"
          >
            View
          </button>
        </li>
        <li v-if="upcomingTickets.length === 0" class="text-gray-400 text-sm">No upcoming tickets</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {  computed, onMounted } from 'vue'
import { useReservationStore } from '@/stores/reservationStore'
import { useTicketStore } from '@/stores/ticketStore'
import { defineEmits } from 'vue'


const reservations = useReservationStore()
const tickets = useTicketStore()


const today = new Date()

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

// Load data
onMounted(async () => {
  await reservations.getAllReservations()
  await tickets.fetchAllTickets()
})

// TODAY STATS
const formatDate = (iso: string) => {
  const d = new Date(iso)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const todayStr = (() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
})()

// TODAY STATS
const todaysReservations = computed(() =>
  reservations.reservations.filter(r => formatDate(r.date) === todayStr)
)

const todaysTickets = computed(() =>
  tickets.tickets.filter(t => formatDate(t.date) === todayStr && t.payment_status === 'paid')
)

const todaysRevenue = computed(() =>
  todaysTickets.value.reduce((sum, t) => sum + Number(t.total_price), 0)
)

const totalTicketRevenue = computed(() =>
  todaysTickets.value.reduce((sum, t) => sum + Number(t.total_price), 0)
)

// UPCOMING RESERVATIONS & TICKETS (next 3)
const upcomingReservations = computed(() =>
  reservations.reservations
    .filter(r => new Date(r.date) > today)
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0,3)
)

const upcomingTickets = computed(() =>
  tickets.tickets
    .filter(t => new Date(t.date) > today && t.payment_status === 'paid')
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0,3)
)


const emit = defineEmits<{
  (e: 'switch-tab', tab: 'tickets' | 'reservations' | 'statistics'): void
}>()

const goToTab = (tab: 'tickets' | 'reservations' | 'statistics') => {
  emit('switch-tab', tab)
}
</script>

<style scoped>
/* Optional: subtle hover & transitions */
.bg-white {
  transition: box-shadow 0.2s ease;
}
</style>
