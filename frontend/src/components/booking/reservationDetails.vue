<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
    <div class="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
      <h1 class="text-3xl font-bold text-indigo-700 mb-6">Reservation Details</h1>

      <!-- Summary Card -->
      <div v-if="reservationData" class="bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-200">
        <h2 class="text-xl font-semibold text-indigo-800 mb-2">Your Reservation Summary</h2>
        <ul class="text-gray-700 space-y-1">
          <li><strong>Event Type:</strong> {{ reservationData.type }}</li>
          <li><strong>Option:</strong> {{ reservationData.option }}</li>
          <li><strong>People:</strong> {{ reservationData.people }}</li>
          <li><strong>Add-ons:</strong> {{ reservationData.addons.join(', ') || 'None' }}</li>
          <li><strong>Total Price:</strong> {{ reservationData.total }} zł</li>
        </ul>
      </div>

      <!-- Reservation Form -->
      <form @submit.prevent="submitReservation" class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Contact Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <input v-model="form.firstName" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <input v-model="form.lastName" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input v-model="form.email" type="email" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input v-model="form.phone" type="tel" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Reservation Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input disabled v-model="form.date" type="date" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Start Time</label>
              <input v-model="form.time" type="time" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mt-4">Additional Notes</label>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Special requests, dietary needs, etc."
              class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-between items-center mt-6">
         <button
            type="button"
            @click="$emit('back')"
            class="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition"
          >
            ← Back
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Confirm Reservation
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface ReservationData {
  type: string
  option: string
  people: number
  addons: string[]
  total: number
}

const props = defineProps<{ reservationData: ReservationData }>()

interface ReservationForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  time: string
  notes: string
}

const route = useRoute()
const router = useRouter()

const form = ref<ReservationForm>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  notes: '',
})

const submitReservation = () => {
  // Make sure reservationData exists
  if (!props.reservationData) {
    alert('No reservation selected!')
    return
  }

  // Basic validation
  if (!form.value.firstName || !form.value.lastName || !form.value.email || !form.value.phone || !form.value.date || !form.value.time) {
    alert('Please fill in all required fields.')
    return
  }

  // Merge reservation info + form info
  const finalData = {
    ...props.reservationData,
    ...form.value,
  }

  console.log('✅ Reservation Submitted:', finalData)

 router.push({
    name: 'payment',
    params: { type: 'reservation' }, // indicates this came from reservation
    query: { data: JSON.stringify(finalData), date: form.value.date }
  })
}

// Optional: watch for new data passed from the selector
watch(
  () => props.reservationData,
  (newVal) => {
    if (newVal) {
      console.log('Received reservation data:', newVal)
      // You could prefill something here if needed
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (route.query.date) {
    // Convert to YYYY-MM-DD format if needed
    const selectedDate = new Date(route.query.date as string)
    const yyyy = selectedDate.getFullYear()
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const dd = String(selectedDate.getDate()).padStart(2, '0')
    form.value.date = `${yyyy}-${mm}-${dd}`
  }
})
</script>
