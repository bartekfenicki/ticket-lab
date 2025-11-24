<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
      <h1 class="text-3xl font-bold text-indigo-700 mb-6">🎫 Tickets Manager</h1>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          v-model="searchEmail"
          placeholder="Search by email"
          class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select v-model="paymentFilter" class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>

        <input
            type="date"
            v-model="dateFilter"
            class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="showUnusedOnly" />
          Show only unused tickets
        </label>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-gray-500">Loading tickets...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>

      <!-- Tickets List -->
      <div v-else>
        <div v-if="filteredTickets.length" class="space-y-4">
          <div
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            class="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <p><strong>ID:</strong> {{ ticket.id }}</p>
            <p><strong>Full Name:</strong> {{ ticket.full_name }}</p>
            <p><strong>Email:</strong> {{ ticket.email }}</p>
            <p><strong>Phone:</strong> {{ ticket.phone || "-" }}</p>
            <p><strong>Date:</strong> {{ formatDate(ticket.date) }}</p>
            <p><strong>Total Price:</strong> {{ ticket.total_price }} PLN</p>
            <p><strong>Payment Status:</strong> {{ ticket.payment_status }}</p>
            <p><strong>Used:</strong> {{ ticket.used ? "Yes" : "No" }}</p>
          </div>
        </div>
        <div v-else class="text-gray-500">No tickets found.</div>
      </div>

      <!-- Refresh Button -->
      <button
        @click="fetchTickets"
        class="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Refresh Tickets
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTicketStore } from '@/stores/ticketStore'
import { storeToRefs } from 'pinia'

// Pinia store
const ticketStore = useTicketStore()
const { tickets, loading, error } = storeToRefs(ticketStore)

// Filters
const searchEmail = ref('')
const paymentFilter = ref('')
const showUnusedOnly = ref(false)
const dateFilter = ref('')

// Fetch tickets on mount
const fetchTickets = async () => {
  await ticketStore.fetchAllTickets()
}

onMounted(fetchTickets)

// Helper function to format dates nicely
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  return d.toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Computed filtered tickets
const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    let matches = true

    if (searchEmail.value) {
      matches = ticket.email.toLowerCase().includes(searchEmail.value.toLowerCase())
    }

    if (matches && paymentFilter.value) {
      matches = ticket.payment_status === paymentFilter.value
    }

    if (matches && showUnusedOnly.value) {
      matches = !ticket.used
    }

    // NEW: Date filter
    if (matches && dateFilter.value) {
      const ticketDate = new Date(ticket.date).toISOString().split("T")[0]
      matches = ticketDate === dateFilter.value
    }

    return matches
  })
})
</script>



