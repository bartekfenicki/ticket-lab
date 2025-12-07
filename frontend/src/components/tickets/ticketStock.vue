<template>
  <div class="p-4 md:p-6 bg-white shadow-md rounded-xl space-y-6">

    <h2 class="text-2xl font-semibold text-green-700">Ticket Stock Manager</h2>

    <!-- Bulk Actions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      <input
        type="number"
        v-model.number="defaultStock"
        placeholder="Default stock"
        class="border rounded-lg p-2 w-full"
      />

      <button @click="applyDefaultToAll" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 w-full">
        Apply to All Days
      </button>

      <button @click="applyToWeekdays" class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full">
        Apply to Weekdays
      </button>

      <button @click="applyToWeekends" class="bg-orange-900 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 w-full">
        Apply to Weekends
      </button>
    </div>

    <!-- Month Selector & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
      <div class="flex gap-2 items-center flex-wrap">
        <label class="font-medium">Month:</label>
        <select v-model="selectedMonth" class="border rounded-lg p-2">
          <option v-for="(m, index) in months" :key="index" :value="index">{{ m }}</option>
        </select>

        <select v-model="selectedYear" class="border rounded-lg p-2">
          <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <div class="flex gap-2 flex-wrap mt-2 sm:mt-0">
        <button @click="saveAllStocks" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Save All
        </button>
        <button @click="loadMonthStocks" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Load Stocks
        </button>
      </div>
    </div>

    <!-- Calendar -->
    <!-- Large screens: grid 7 columns -->
    <div class="hidden md:grid grid-cols-7 gap-2 text-center">
      <div class="font-semibold">Sun</div>
      <div class="font-semibold">Mon</div>
      <div class="font-semibold">Tue</div>
      <div class="font-semibold">Wed</div>
      <div class="font-semibold">Thu</div>
      <div class="font-semibold">Fri</div>
      <div class="font-semibold">Sat</div>

      <!-- Empty cells for first week offset -->
      <div v-for="n in monthStartOffset" :key="'empty-'+n"></div>

      <!-- Days -->
      <div
        v-for="day in monthDays"
        :key="day.toISOString()"
        class="border rounded-lg p-2 flex flex-col items-center justify-center"
      >
        <div class="font-medium">{{ day.getDate() }}</div>
        <input
          type="number"
          v-model.number="getDayStock(day).total_quantity"
          class="border rounded-lg p-1 w-16 text-center mt-1"
        />
        <div class="text-sm text-gray-500 mt-1">Sold: {{ getDayStock(day).sold_quantity }}</div>
      </div>
    </div>

    <!-- Mobile / Tablet: stacked cards -->
    <!-- Mobile / Tablet: stacked cards with weekday -->
<div class="md:hidden grid gap-3">
  <div
    v-for="day in monthDays"
    :key="day.toISOString()"
    class="border rounded-lg p-3 bg-gray-50 shadow-sm flex flex-col space-y-2"
  >
    <!-- Day & Weekday -->
    <div class="flex justify-between items-center">
      <span class="font-semibold">Day:</span>
      <span>{{ formatWeekday(day) }}, {{ day.getDate() }}/{{ day.getMonth() + 1 }}</span>
    </div>

    <!-- Stock input -->
    <div class="flex justify-between items-center">
      <span class="font-semibold">Stock:</span>
      <input
        type="number"
        v-model.number="getDayStock(day).total_quantity"
        class="border rounded-lg p-1 w-1/2 text-center"
      />
    </div>

    <!-- Sold quantity -->
    <div class="flex justify-between items-center">
      <span class="font-semibold">Sold:</span>
      <span>{{ getDayStock(day).sold_quantity }}</span>
    </div>
  </div>
</div>

  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTicketStockStore } from '@/stores/ticketStockStore'
import type { TicketStock } from '@/stores/ticketStockStore'

const store = useTicketStockStore()

// State
const defaultStock = ref(100)
const selectedMonth = ref(new Date().getMonth())
const selectedYear = ref(new Date().getFullYear())

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatWeekday = (date: Date) => {
  return weekdays[date.getDay()];
};

const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i)

// Map of date keys to stock objects
const dayStocks = ref<Record<string, TicketStock>>({})

// Helper to format Date as key
const dayKey = (date: Date): string => date.toISOString().split("T")[0]!

// Compute all days in the selected month
const monthDays = computed(() => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const days: Date[] = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
})

// Calculate offset for the first week
const monthStartOffset = computed(() => {
  const firstDay = new Date(selectedYear.value, selectedMonth.value, 1)
  return firstDay.getDay()
})

// Helper to get or create stock for a day
const getDayStock = (day: Date): TicketStock => {
  const key = dayKey(day)

  if (!dayStocks.value[key]) {
    dayStocks.value[key] = {
      ticket_type_id: 1,
      date: key,
      total_quantity: defaultStock.value || 0,
      sold_quantity: 0,
      modified_by: null
    }
  }

  // sanitize every time
  const stock = dayStocks.value[key]
  stock.total_quantity = Number(stock.total_quantity) || 0
  stock.sold_quantity = Number(stock.sold_quantity) || 0

  return stock
}


// Load existing stocks for the month
const loadMonthStocks = async () => {
  await store.fetchStocks()

  monthDays.value.forEach(day => {
    const key = dayKey(day)
    const existing = store.stocks.find(s => s.date.slice(0,10) === key)

    if (existing) {
      // copy full object with ID
      dayStocks.value[key] = { ...existing }
    } else {
      // create *placeholder* with no ID
      dayStocks.value[key] = {
        ticket_type_id: 1,
        date: key,
        total_quantity: defaultStock.value,
        sold_quantity: 0
      }
    }
  })
}

const sanitizeStock = (stock: any) => {
  return {
    ...stock,
    total_quantity: Number(stock.total_quantity) || 0,
    sold_quantity: Number(stock.sold_quantity) || 0,
    ticket_type_id: Number(stock.ticket_type_id),
  }
}

// Bulk actions
const applyDefaultToAll = () => {
  monthDays.value.forEach(day => getDayStock(day).total_quantity = defaultStock.value)
}

const applyToWeekdays = () => {
  monthDays.value.forEach(day => {
    if (day.getDay() !== 0 && day.getDay() !== 6) getDayStock(day).total_quantity = defaultStock.value
  })
}

const applyToWeekends = () => {
  monthDays.value.forEach(day => {
    if (day.getDay() === 0 || day.getDay() === 6) getDayStock(day).total_quantity = defaultStock.value
  })
}

const saveAllStocks = async () => {
  for (const day of monthDays.value) {
    const stock = sanitizeStock(getDayStock(day))

    // Remove ID when upserting
    const { id, updated_at, ...payload } = stock

    await store.upsertStock(payload)
  }
  alert("All stocks saved!")
}

// Load initial stocks (initialize days)
onMounted(async() => {
  await store.fetchStocks()
  monthDays.value.forEach(day => getDayStock(day))
})
</script>

<style scoped>
input {
  text-align: center;
}
</style>

