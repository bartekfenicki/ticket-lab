<template>
  <div class="min-h-screen  py-12 px-4">
    <div class="max-w-4xl mx-auto bg-white shadow-lg overflow-hidden pb-8 rounded-xl space-y-6">


        <div class="bg-green-600 text-white p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                <h1 class="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    💳 Payment Details
                  </h1>

                  <p class="text-gray-100">
                    Booking Type: <strong>{{ bookingType === 'reservation' ? 'Reservation' : 'Ticket' }}</strong>
                  </p>
                  <p class="text-gray-100">
                    Date: <strong>{{ bookingData?.date }}</strong>
                  </p>
                </div>

                <!-- Return Button -->
                <button
                  @click="goBack"
                  class="flex items-center gap-2 bg-white text-green-700 px-5 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-all border border-white/30 shadow-sm"
                >
                  ← Back
                </button>
              </div>

      <!-- Event / Ticket Info -->
      <div class="border border-gray-200 rounded-lg m-8 p-4 space-y-2 bg-gray-50">
        <h2 class="text-xl font-semibold text-gray-800">Booking Summary</h2>
        <div v-if="bookingType === 'reservation'">
          <p><strong>Event Type:</strong> {{ bookingData?.type }}</p>
          <p><strong>Selected Option:</strong> {{ bookingData?.option }}</p>
          <p><strong>Number of People:</strong> {{ bookingData?.people }}</p>
          <p v-if="bookingData?.addons?.length"><strong>Add-ons:</strong> {{ bookingData.addons.join(', ') }}</p>
        </div>
       <div v-else>
          <h3 class="font-semibold text-gray-800">Tickets:</h3>

          <div
            v-for="t in bookingData?.tickets"
            :key="t.id"
            class="flex justify-between items-center border-b py-2"
          >
            <div>
              <p class="font-medium">{{ t.name }}</p>
              <p class="text-gray-500 text-sm">
                Price: {{ t.price }} zł × {{ t.quantity }}
              </p>
            </div>

            <p class="font-bold text-green-700">
              {{ t.price * t.quantity }} zł
            </p>
          </div>

          <p class="mt-3 font-bold text-lg text-green-700">
            Total Tickets: {{ bookingData?.totalTickets }}
          </p>
          <p class="font-bold text-lg text-green-700">
            Total Price: {{ bookingData?.totalPrice }} zł
          </p>
        </div>
      </div>

      <!-- Personal Info -->
      <div class="border border-gray-200 rounded-lg p-4 m-8 space-y-4 bg-gray-50">
        <h2 class="text-xl font-semibold text-gray-800">Personal Information</h2>
        <p><strong>First Name:</strong> {{ bookingData?.firstName }}</p>
        <p><strong>Last Name:</strong> {{ bookingData?.lastName }}</p>
        <p><strong>Email:</strong> {{ bookingData?.email }}</p>
        <p><strong>Phone:</strong> {{ bookingData?.phone }}</p>
        <p v-if="bookingData?.names" ><strong>Additional Names: </strong> {{ bookingData.names }}</p>
        <p v-if="bookingData?.time"><strong>Time:</strong> {{ bookingData.time }}</p>
        <p v-if="bookingData?.notes"><strong>Notes:</strong> {{ bookingData.notes }}</p>
      </div>

      <!-- Payment Method Selection -->
      <div v-if="bookingType === 'tickets'" class="border  border-gray-200 rounded-lg p-4 m-8 bg-gray-50 space-y-4">
  <h2 class="text-xl font-semibold text-gray-800">Select Payment Method</h2>
  <div class="flex flex-col md:flex-row gap-4 mt-2">

    <!-- Pay at Counter -->
    <label
      class="flex-1 flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-green-500 transition-all"
      :class="selectedPaymentMethod === 'pay_at_counter' ? 'border-green-600 bg-indigo-50' : ''"
    >
      <input
        type="radio"
        value="pay_at_counter"
        v-model="selectedPaymentMethod"
        class="hidden"
      />
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c.667 0 1.333.667 1.333 2 0 1.333-.667 2-1.333 2s-1.333-.667-1.333-2c0-1.333.667-2 1.333-2zM12 12v6m0 0h-3m3 0h3" />
      </svg>
      <span class="text-gray-700 font-medium">Pay at the park counter</span>
    </label>

    <!-- Bank Transfer -->
    <label
      class="flex-1 flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-green-500 transition-all"
      :class="selectedPaymentMethod === 'bank_transfer' ? 'border-green-600 bg-indigo-50' : ''"
    >
      <input
        type="radio"
        value="bank_transfer"
        v-model="selectedPaymentMethod"
        class="hidden"
      />
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h4l3 10h8l3-10h4" />
      </svg>
      <span class="text-gray-700 font-medium">Bank Transfer</span>
    </label>

    <!-- Pay by Card -->
    <label
      class="flex-1 flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-green-500 transition-all"
      :class="selectedPaymentMethod === 'card' ? 'border-green-600 bg-indigo-50' : ''"
    >
      <input
        type="radio"
        value="card"
        v-model="selectedPaymentMethod"
        class="hidden"
      />
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        class="w-3/4 mx-auto block px-6 py-3 mt-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Payment
      </button>
      <button
        v-else
        @click="handleReceipt"
        class="w-full px-6 py-3 mt-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Get the receipt
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useTicketStore, type Ticket } from '@/stores/ticketStore'

const route = useRoute()
const router = useRouter()

// Type of booking: "reservation" or "tickets"
const bookingType = ref(route.params.type as string)

const ticketStore = useTicketStore()

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

const handlePayment = async () => {
  if (!bookingData.value) return

  try {
    // Construct the ticket payload
    const ticketPayload: Omit<Ticket, "id" | "qr_token" | "used" | "created_at"> = {
      date: bookingData.value.date,
      email: bookingData.value.email,
      phone: bookingData.value.phone,
      full_name: `${bookingData.value.firstName} ${bookingData.value.lastName}`,
      other_names: bookingData.value.names || "",
      total_price: bookingData.value.totalPrice,
      special_event_id: null, // or from your booking data
      payment_status: "pending", // default
      items: bookingData.value.tickets.map((t: any) => ({
        ticket_type_id: t.id,
        quantity: t.quantity,
        price: t.price,
        name: t.name,
      })),
    }

    console.log("Ticket payload being sent:", ticketPayload);

const newTicket = await ticketStore.createTicket(ticketPayload);
if (!newTicket) {
  console.error("Ticket creation failed:", ticketPayload);
  throw new Error('Ticket creation failed');
}
if (!newTicket?.id) {
  throw new Error("Ticket creation returned invalid ticket with no id");
}

console.log("Ticket created successfully:", newTicket);



    // Redirect to ticketReceipt with ticket ID
    router.push({
      name: 'ticketReceipt',
      params: { ticketId: Number(newTicket.id) } ,
      query: { email: newTicket.email }
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })

  } catch (err: any) {
    console.error('Failed to create ticket:', err)
    alert('Failed to create ticket. Please try again.')
  }
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
