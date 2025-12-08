<template>
  <div class="min-h-screen   py-12 px-4">
    <div class="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">


      <div class="bg-green-600 text-white p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-1 flex items-center gap-2">
             Ticket Booking
          </h1>
          <p class="text-indigo-100 text-lg">
            Selected Date:
            <strong class="text-white">{{ formattedDate }}</strong>
          </p>
        </div>


        <button
          @click="goHome"
          class="flex items-center gap-2 bg-white text-green-700 px-5 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-all border border-white/30 shadow-sm"
        >
          ← Back to Home
        </button>
      </div>

      <div class="p-8 space-y-10">

        <section class="border-b pb-10">
          <h2 class="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
            <span class="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">Step 1</span>
            Choose Your Tickets
          </h2>
          <TicketTypeSelect
            :date="date"
            v-model="tickets" />
        </section>

        <section class="pb-10">
          <h2 class="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
            <span class="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">Step 2</span>
            Enter Your Details
          </h2>
          <TicketPersonalInfo v-model="personalInfo" />
        </section>

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
              class="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tickets = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const personalInfo = ref<any>({})

const totalTickets = computed(() =>
  tickets.value.reduce((acc, t) => acc + (t.quantity || 0), 0)
)
const totalPrice = computed(() =>
  tickets.value.reduce((acc, t) => acc + (t.quantity || 0) * (t.price || 0), 0)
)

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

  router.push({
    name: 'payment',
    params: { type: 'tickets' },
    query: { data: JSON.stringify(bookingData), date }
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goHome = () => {
  router.push({ name: 'home' }).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
</script>
