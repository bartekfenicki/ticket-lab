<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
      <h1 class="text-3xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
        💳 Payment Details
      </h1>

      <p class="text-gray-700">
        Booking Type: <strong>{{ bookingType === 'reservation' ? 'Reservation' : 'Ticket' }}</strong>
      </p>
      <p class="text-gray-700">
        Date: <strong>{{ bookingData?.date }}</strong>
      </p>

      <!-- Event / Ticket Info -->
      <div class="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50">
        <h2 class="text-xl font-semibold text-gray-800">Booking Summary</h2>
        <div v-if="bookingType === 'reservation'">
          <p><strong>Event Type:</strong> {{ bookingData?.type }}</p>
          <p><strong>Selected Option:</strong> {{ bookingData?.option }}</p>
          <p><strong>Number of People:</strong> {{ bookingData?.people }}</p>
          <p v-if="bookingData?.addons?.length"><strong>Add-ons:</strong> {{ bookingData.addons.join(', ') }}</p>
        </div>
        <div v-else>
          <p><strong>Ticket Type:</strong> {{ bookingData?.option }}</p>
          <p><strong>Number of Tickets:</strong> {{ bookingData?.people }}</p>
        </div>
        <p class="font-bold text-indigo-700 text-lg">Total Price: {{ bookingData?.total }} zł</p>
      </div>

      <!-- Personal Info -->
      <div class="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
        <h2 class="text-xl font-semibold text-gray-800">Personal Information</h2>
        <p><strong>First Name:</strong> {{ bookingData?.firstName }}</p>
        <p><strong>Last Name:</strong> {{ bookingData?.lastName }}</p>
        <p><strong>Email:</strong> {{ bookingData?.email }}</p>
        <p><strong>Phone:</strong> {{ bookingData?.phone }}</p>
        <p v-if="bookingData?.time"><strong>Time:</strong> {{ bookingData.time }}</p>
        <p v-if="bookingData?.notes"><strong>Notes:</strong> {{ bookingData.notes }}</p>
      </div>

      <!-- Payment Method Selection -->
      <div v-if="bookingType === 'tickets'" class="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
  <h2 class="text-xl font-semibold text-gray-800">Select Payment Method</h2>
  <div class="flex flex-col md:flex-row gap-4 mt-2">

    <!-- Pay at Counter -->
    <label
      class="flex-1 flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-all"
      :class="selectedPaymentMethod === 'pay_at_counter' ? 'border-indigo-600 bg-indigo-50' : ''"
    >
      <input
        type="radio"
        value="pay_at_counter"
        v-model="selectedPaymentMethod"
        class="hidden"
      />
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c.667 0 1.333.667 1.333 2 0 1.333-.667 2-1.333 2s-1.333-.667-1.333-2c0-1.333.667-2 1.333-2zM12 12v6m0 0h-3m3 0h3" />
      </svg>
      <span class="text-gray-700 font-medium">Pay at the park counter</span>
    </label>

    <!-- Bank Transfer -->
    <label
      class="flex-1 flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-all"
      :class="selectedPaymentMethod === 'bank_transfer' ? 'border-indigo-600 bg-indigo-50' : ''"
    >
      <input
        type="radio"
        value="bank_transfer"
        v-model="selectedPaymentMethod"
        class="hidden"
      />
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h4l3 10h8l3-10h4" />
      </svg>
      <span class="text-gray-700 font-medium">Bank Transfer</span>
    </label>

    <!-- Pay by Card -->
    <label
      class="flex-1 flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-all"
      :class="selectedPaymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50' : ''"
    >
      <input
        type="radio"
        value="card"
        v-model="selectedPaymentMethod"
        class="hidden"
      />
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h16" />
      </svg>
      <span class="text-gray-700 font-medium">Pay by Card</span>
    </label>

  </div>
</div>


      <!-- Confirm Payment Button -->
      <button
        v-if="bookingType === 'tickets'"
        @click="handlePayment"
        :disabled="!selectedPaymentMethod"
        class="w-full px-6 py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Payment
      </button>
      <button
        v-else
        @click="handleReceipt"
        class="w-full px-6 py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Get the receipt
      </button>

      <!-- Back Button -->
      <button
        @click="goBack"
        class="w-full px-6 py-3 mt-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        ← Back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

// Type of booking: "reservation" or "tickets"
const bookingType = ref(route.params.type as string)

// Parse data from query
const bookingData = ref<any>(null)
const selectedPaymentMethod = ref<string>('')

onMounted(() => {
  if (route.query.data) {
    try {
      bookingData.value = JSON.parse(route.query.data as string)
    } catch (e) {
      console.error('Failed to parse booking data:', e)
      bookingData.value = null
    }
  }
})

// Go to actual payment processing page (placeholder)
const handleReceipt = () => {
  router.push({ name: 'reservationReceipt' }).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

// Go back to previous page depending on booking type
const goBack = () => {
  if (bookingType.value === 'reservation') {
    router.push({ name: 'reservation', query: { date: bookingData.value?.date } })
  } else {
    router.push({ name: 'tickets', query: { date: bookingData.value?.date } })
  }
}
</script>
