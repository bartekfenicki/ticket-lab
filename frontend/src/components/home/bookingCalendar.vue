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
          ? 'text-green-600 border-b-4 border-green-600 bg-indigo-50'
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
          @click="!isClosedDay(day) && selectDate(day)"
          :disabled="isClosedDay(day)"
          :class="dayClass(day)"
          class="relative p-2 rounded-lg flex flex-col items-center"
        >
        <span>{{ day }}</span>
        <!-- Dot underneath -->
       <span
        v-if="reservations.reservations.length && hasReservation(day) && activeTab === 'Reservations'"
        class="mt-1 w-2 h-2 rounded-full bg-indigo-600"
      ></span>
      </button>
    </div>

      <!-- Selected Date + Event Info -->
      <div
        v-if="selectedDate"
        class="mt-8 border-t pt-4 flex flex-col items-center space-y-4"
      >
        <p class="text-gray-700 font-medium">
          You selected:
          <span class="text-green-600 font-semibold">
            {{ selectedDateLabel }}
          </span>
        </p>

        <div v-if="selectedEvent" class="bg-yellow-100 border border-yellow-600 p-3 rounded-lg w-full text-center">
          <p class="font-semibold text-yellow-700">{{ selectedEvent.title }}</p>
          <p class="text-yellow-600">{{ selectedEvent.description }}</p>
        </div>

        <div
            v-if="activeTab === 'Tickets'"
            class="w-full mt-4 px-3 py-3 border border-gray-200 rounded-lg bg-blue-50 shadow-sm text-center"
          >
            <p class="text-gray-700 font-medium">
              Stock for this day:
            </p>

            <p class="text-lg font-semibold text-yellow-700 mt-1">
              Total: {{ selectedDayStock?.total_quantity ?? '—' }} |
              Sold: {{ selectedDayStock?.sold_quantity ?? '—' }}
            </p>

            <p class="text-green-600 font-bold mt-1">
              Tickets Left:
              {{ remainingTickets }}
            </p>
      </div>
<div v-if="activeTab === 'Reservations'" class="w-full">
       <div v-if="selectedReservations.length" class="mt-4 w-full">
  <!-- Slots Info -->
  <div class="flex justify-between items-center mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
    <p class="text-gray-700 font-medium">
      Reservations: <span class="font-semibold text-gray-800">{{ selectedReservations.length }}/8</span>
    </p>
    <p class="text-gray-500 text-sm">
      {{ 8 - selectedReservations.length }} slots left
    </p>
  </div>



  <!-- Reservation Cards -->
  <div class="space-y-3">
    <div
      v-for="res in selectedReservations"
      :key="res.id"
      class="bg-white border border-gray-200 p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 flex justify-between items-center"
    >
      <div class="flex flex-col text-left">
        <p class="font-semibold text-gray-800 text-lg">{{ res.title }}</p>
        <p class="text-gray-500 text-sm">
         Start time: <span class="font-semibold text-green-600">{{ res.start_time ? res.start_time.slice(0,5) : formatTime(res.date) }} </span>
        </p>
      </div>
    </div>
  </div>
</div>
<!--Optional: Empty state if no reservations -->
  <div v-else  class="mt-4 w-full px-4 py-6 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
    No reservations for this day
  </div>
</div>
        <button
          v-if="isSelectedDateInFutureOrToday"
          @click="goToBooking"
          :disabled="selectedReservations.length >= 8 || isClosedDay(selectedDate.getDate())"
          class="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ activeTab === 'Tickets' ? 'Book Tickets' : 'Book Reservation' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSpecialEventsStore } from '@/stores/specialEventsStore'
import { useReservationStore } from '@/stores/reservationStore'
import { useClosedDaysStore } from '@/stores/closedDaysStore'
import { useTicketStockStore } from '@/stores/ticketStockStore'

const router = useRouter()
const events = useSpecialEventsStore()
const reservations = useReservationStore()
const closedDays = useClosedDaysStore()

// Tabs
const tabs = ['Tickets', 'Reservations']
const activeTab = ref('Tickets')

// Calendar state
const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const selectedDate = ref<Date | null>(today)

onMounted(async () => {
  await events.fetchEvents()
  await reservations.getAllReservations()
    await closedDays.fetchClosedDays()
    await ticketStockStore.fetchStocks();

  console.log("Closed days:", closedDays.byDate)
  console.log("Reservations loaded:", reservations.reservations)
  console.log("By date:", reservationsByDate.value)
})

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Days in month
const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())

// First day offset
const firstDayOfMonth = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay())

watch(
  () => reservations.reservations,
  (newVal) => {
    console.log("Reservations updated:", newVal)
  },
  { deep: true }
)


// Load events from store
const eventsByDate = computed(() => {
  const map: Record<string, any> = {}
  events.events.forEach(event => {
    if (event.active) map[event.date] = event
  })
  return map
})

const reservationsByDate = computed(() => {
  const map: Record<string, any[]> = {} // array of reservations per day
  reservations.reservations?.forEach(reservation => {
    if (reservation?.date) {
      const d = new Date(reservation.date)
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      if (!map[dateKey]) map[dateKey] = []
      map[dateKey].push(reservation)
    }
  })

  // Optional: sort each day's reservations by time
  Object.values(map).forEach(arr => arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))

  return map
})

const hasReservation = (day: number) => {
  const key = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  return !!reservationsByDate.value[key]
}

const selectedReservations = computed(() => {
  if (!selectedDate.value) return []
  const key = `${selectedDate.value.getFullYear()}-${String(selectedDate.value.getMonth() + 1).padStart(2,'0')}-${String(selectedDate.value.getDate()).padStart(2,'0')}`
  return reservationsByDate.value[key] || []
})

const formatTime = (isoDate: string) => {
  const d = new Date(isoDate)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

console.log(hasReservation)

// Check if a day has an event
const hasEvent = (day: number) => {
  const key = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  return !!eventsByDate.value[key]
}

// Selected event
const selectedEvent = computed(() => {
  if (!selectedDate.value) return null
  const key = `${selectedDate.value.getFullYear()}-${String(selectedDate.value.getMonth() + 1).padStart(2,'0')}-${String(selectedDate.value.getDate()).padStart(2,'0')}`
  return eventsByDate.value[key] || null
})

// Button classes for calendar days
const dayClass = (day: number) => {
  const cls = [
    "relative",
    "p-2",
    "rounded-lg",
    "transition-all",
    "duration-150",
    "font-medium"
  ]

  // Closed days (priority)
  if (isClosedDay(day)) {
    cls.push(
      "bg-red-100",
      "opacity-50",
      "cursor-not-allowed",
      "text-red-700",
      "font-semibold"
    )
    return cls.join(" ")
  }

  if (selectedDate.value?.getDate() === day &&
      selectedDate.value?.getMonth() === currentMonth.value &&
      selectedDate.value?.getFullYear() === currentYear.value) {
    cls.push("bg-green-600", "text-white")
  } else if (hasEvent(day)) {
    cls.push("bg-yellow-800", "text-white", "hover:bg-green-800")
  } else if (isToday(day)) {
    cls.push("border", "border-green-600")
  } else {
    cls.push("hover:bg-green-100")
  }

  return cls.join(" ")
}

const isToday = (day: number) => (
  day === today.getDate() &&
  currentMonth.value === today.getMonth() &&
  currentYear.value === today.getFullYear()
)

const isClosedDay = (day: number) => {
  if (!day) return false;

  const date = `${currentYear.value}-${pad(currentMonth.value + 1)}-${pad(day)}`;
  return !!closedDays.byDate?.[date];
};

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

const selectDate = (day: number) => {
  selectedDate.value = new Date(currentYear.value, currentMonth.value, day, 0,0,0,0)
}

const isSelectedDateInFutureOrToday = computed(() => {
  if (!selectedDate.value) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sel = new Date(selectedDate.value);
  sel.setHours(0, 0, 0, 0);

  return sel >= today;
});

const ticketStockStore = useTicketStockStore()

const selectedDayStock = computed(() => {
  if (!selectedDate.value) return null
  if (activeTab.value !== "Tickets") return null

  const key = selectedDate.value.toISOString().slice(0, 10)

  return ticketStockStore.stocks.find(s => s.date.slice(0, 10) === key) || null
})

const remainingTickets = computed(() => {
  if (!selectedDayStock.value) return 0
  return (
    selectedDayStock.value.total_quantity -
    selectedDayStock.value.sold_quantity
  )
})

// Navigate to booking page with selected date
const goToBooking = () => {
  if (!selectedDate.value) return
  const d = selectedDate.value
  const isoDateLocal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const route = activeTab.value === 'Tickets'
    ? { name: 'tickets', query: { date: isoDateLocal } }
    : { name: 'reservation', query: { date: isoDateLocal } }
  router.push(route)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

