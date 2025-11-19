<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-emerald-50 py-12 px-4">
    <div class="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">

      <!-- Header -->
      <div class="bg-indigo-600 text-white p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-1 flex items-center gap-2">
            🎟 Ticket Booking
          </h1>
          <p class="text-indigo-100 text-lg">
            Selected Date:
            <strong class="text-white">{{ formattedDate }}</strong>
          </p>
        </div>

        <!-- Return Button -->
        <button
          @click="goHome"
          class="flex items-center gap-2 bg-white text-indigo-700 px-5 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-all border border-white/30 shadow-sm"
        >
          ← Back to Home
        </button>
      </div>

      <!-- Content -->
      <div class="p-8 space-y-10">

        <!-- Ticket selection -->
        <section class="border-b pb-10">
          <h2 class="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
            <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">Step 1</span>
            Choose Your Tickets
          </h2>
          <TicketTypeSelect v-model:tickets="tickets" />
        </section>

        <!-- Personal Info -->
        <section class="pb-10">
          <h2 class="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
            <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">Step 2</span>
            Enter Your Details
          </h2>
          <TicketPersonalInfo v-model="personalInfo" />
        </section>

        <!-- Summary / action -->
        <section class="pt-8 border-t">
          <div class="flex justify-between items-center flex-wrap gap-4">
            <div>
              <p class="text-gray-700">
                Total Tickets:
                <strong>{{ totalTickets }}</strong>
              </p>
              <p class="text-gray-700">
                Total Price:
                <strong>{{ totalPrice }} zł</strong>
              </p>
            </div>
            <button
              @click="proceedToPayment"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Proceed to Payment →
            </button>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TicketTypeSelect from '@/components/booking/ticketTypeSelect.vue'
import TicketPersonalInfo from '@/components/booking/ticketPersonalInfo.vue'

const route = useRoute()
const router = useRouter()

const date = route.query.date as string

const formattedDate = computed(() => {
  if (!date) return 'No date selected'
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// State
const tickets = ref<any[]>([])
const personalInfo = ref<any>({})

// Computed totals
const totalTickets = computed(() =>
  tickets.value.reduce((acc, t) => acc + (t.quantity || 0), 0)
)
const totalPrice = computed(() =>
  tickets.value.reduce((acc, t) => acc + (t.quantity || 0) * (t.price || 0), 0)
)

// Single proceed button
const proceedToPayment = () => {
  if (totalTickets.value === 0) {
    alert('Please select at least one ticket.')
    return
  }
  if (!personalInfo.value.firstName || !personalInfo.value.lastName || !personalInfo.value.email || !personalInfo.value.phone) {
    alert('Please fill in all personal information fields.')
    return
  }

  const bookingData = {
    date,
    tickets: tickets.value,
    totalTickets: totalTickets.value,
    totalPrice: totalPrice.value,
    ...personalInfo.value
  }

  // Navigate to payment page
  router.push({
    name: 'payment',
    params: { type: 'tickets' },
    query: { data: JSON.stringify(bookingData), date }
  })
}

const goHome = () => {
  router.push({ name: 'home' }).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
</script>
