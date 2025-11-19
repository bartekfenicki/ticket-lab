<template>
  <div class="max-w-3xl mx-auto mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
    <!-- Tabs -->
    <div class="flex border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="flex-1 py-3 text-center font-semibold transition-colors duration-200"
        :class="activeTab === tab
          ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50'
          : 'text-gray-600 hover:bg-gray-50'"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Calendar Panel -->
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <button
          @click="prevMonth"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          ‹
        </button>
        <h2 class="text-xl font-bold text-gray-800">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </h2>
        <button
          @click="nextMonth"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          ›
        </button>
      </div>

      <!-- Weekday Labels -->
      <div class="grid grid-cols-7 text-center text-gray-500 font-semibold mb-2">
        <div v-for="d in weekDays" :key="d">{{ d }}</div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-1 text-center">
        <div v-for="n in firstDayOfMonth" :key="'empty-' + n"></div>
        <button
          v-for="day in daysInMonth"
          :key="day"
          @click="selectDate(day)"
          class="relative p-2 rounded-lg transition-all duration-150 font-medium"
          :class="[
            isToday(day) ? 'border border-indigo-600 ' : '',
            selectedDate?.getDate() === day &&
            selectedDate?.getMonth() === currentMonth &&
            selectedDate?.getFullYear() === currentYear
              ? 'bg-indigo-600 text-white'
              : 'hover:bg-indigo-100'
          ]"
        >
          {{ day }}
        </button>
      </div>

      <!-- Selected Date + Book Button -->
      <div
        v-if="selectedDate"
        class="mt-8 border-t pt-4 flex flex-col items-center space-y-4"
      >
        <p class="text-gray-700 font-medium">
          You selected:
          <span class="text-indigo-600 font-semibold">
            {{ selectedDateLabel }}
          </span>
        </p>

        <button
          @click="goToBooking"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          {{ activeTab === 'Tickets' ? 'Book Tickets' : 'Book Reservation' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Tabs
const tabs = ['Tickets', 'Reservations']
const activeTab = ref('Tickets')

// Calendar state
const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const selectedDate = ref<Date | null>(today)

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Days in month
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

// First day offset
const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const isToday = (day: number) => {
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  )
}



const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}

const selectedDateLabel = computed(() => {
  if (!selectedDate.value) return '—'
  const d = selectedDate.value
  return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
})

const pad = (n: number) => String(n).padStart(2, '0')

// Navigate to booking page with selected date
const selectDate = (day: number) => {
  // create date at LOCAL midnight to avoid timezone shifts
  selectedDate.value = new Date(currentYear.value, currentMonth.value, day, 0, 0, 0, 0)
}

const goToBooking = () => {
  if (!selectedDate.value) return

  // build YYYY-MM-DD from local date parts to avoid timezone shifting
  const d = selectedDate.value
  const isoDateLocal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

 const route =
    activeTab.value === 'Tickets'
      ? { name: 'tickets', query: { date: isoDateLocal } }
      : { name: 'reservation', query: { date: isoDateLocal } }

  router.push(route).then(() => {
    // Ensure scroll resets after navigation
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })
}
</script>
