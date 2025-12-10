<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">

      <div class="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h1 class="text-3xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
          Reservations
        </h1>
        <p class="text-gray-700">
          Selected Date: <strong>{{ date }}</strong>
        </p>
      </div>

      <div class="bg-white shadow-md rounded-xl p-6 space-y-6">
        <transition name="fade" mode="out-in">
          <div v-if="!showDetails">
            <ReservationTypeSelector @proceed="handleProceed" />
          </div>
          <div v-else key="step2">
            <ReservationDetails :reservationData="reservationData" @back="showDetails = false" />
          </div>
        </transition>


      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ReservationTypeSelector from '@/components/booking/reservationTypeSelector.vue'
import ReservationDetails from '@/components/booking/reservationDetails.vue'

const route = useRoute()
const date = route.query.date

const showDetails = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reservationData = ref<any>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleProceed = (data: any) => {
  reservationData.value = data
  showDetails.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
