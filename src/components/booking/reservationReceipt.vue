<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">

      <!-- Header with Print Button -->
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
          🧾 Reservation Receipt
        </h1>
        <button
          @click="printReceipt"
          class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9V2h12v7M6 18v4h12v-4M6 14h12v4H6v-4z"/>
          </svg>
          Print Receipt
        </button>
      </div>

      <!-- Reservation Info -->
      <div class="border border-gray-200 rounded-lg p-6 space-y-4 bg-gray-50">
        <h2 class="text-xl font-semibold text-gray-800">Reservation Summary</h2>
        <p><strong>Event Type:</strong> {{ reservationData.type }}</p>
        <p><strong>Selected Option:</strong> {{ reservationData.option }}</p>
        <p><strong>Number of People:</strong> {{ reservationData.people }}</p>
        <p v-if="reservationData.addons?.length">
          <strong>Add-ons:</strong> {{ reservationData.addons.join(', ') }}
        </p>
        <p class="font-bold text-indigo-700 text-lg">Total Price: {{ reservationData.total }} zł</p>
        <p><strong>Date:</strong> {{ reservationData.date }}</p>
      </div>

      <!-- Personal Information -->
      <div class="border border-gray-200 rounded-lg p-6 space-y-3 bg-gray-50">
        <h2 class="text-xl font-semibold text-gray-800">Personal Information</h2>
        <p><strong>First Name:</strong> {{ reservationData.firstName }}</p>
        <p><strong>Last Name:</strong> {{ reservationData.lastName }}</p>
        <p><strong>Email:</strong> {{ reservationData.email }}</p>
        <p><strong>Phone:</strong> {{ reservationData.phone }}</p>
        <p v-if="reservationData.time"><strong>Time:</strong> {{ reservationData.time }}</p>
        <p v-if="reservationData.notes"><strong>Notes:</strong> {{ reservationData.notes }}</p>
      </div>

      <!-- Payment Instructions -->
      <div class="border border-gray-200 rounded-lg p-6 space-y-3 bg-yellow-50">
        <h2 class="text-xl font-semibold text-yellow-700">Payment Instructions</h2>
        <p>
          Please make your payment via <strong>bank transfer</strong>. The bank account number and
          payment details will be sent to your email shortly after this reservation.
        </p>
        <p>
          Ensure you include your <strong>reservation ID</strong> in the transfer reference to
          correctly match your payment.
        </p>
      </div>

      <!-- Event Guidelines -->
      <div class="border border-gray-200 rounded-lg p-6 space-y-3 bg-gray-50">
        <h2 class="text-xl font-semibold text-gray-800">Event Guidelines</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li>Arrive at the park at least 15 minutes before your scheduled time.</li>
          <li>Bring any necessary documents if using discounted or reduced tickets.</li>
          <li>Follow the safety and event rules provided in the confirmation email.</li>
          <li>For groups larger than 10 people, ensure all members are accounted for upon arrival.</li>
        </ul>
      </div>

      <!-- Footer / Back Button -->
      <button
        @click="goBack"
        class="w-full px-6 py-3 mt-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        ← Back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const route = useRouter()

interface ReservationData {
  type: string
  option: string
  people: number
  addons?: string[]
  total: number
  date: string
  firstName: string
  lastName: string
  email: string
  phone: string
  time?: string
  notes?: string
}

const ReservationData = ref<ReservationData>(null)

const props = defineProps<{
  reservationData: ReservationData
}>()

const router = useRouter()
const goBack = () => {
  router.back()
}


// Print function
const printReceipt = () => {
  window.print()
}
</script>
