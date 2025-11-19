<template>
  <div class="p-6 bg-white shadow-md rounded-xl space-y-6">
    <h2 class="text-2xl font-semibold text-indigo-700">Ticket Stock Manager</h2>

    <!-- Bulk Actions -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        type="number"
        v-model.number="defaultStock"
        placeholder="Default stock"
        class="border rounded-lg p-2"
      />

      <button @click="applyDefaultToAll" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        Apply to All Days
      </button>

      <button @click="applyToWeekdays" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
        Apply to Weekdays
      </button>

      <button @click="applyToWeekends" class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
        Apply to Weekends
      </button>
    </div>

    <!-- Month Selector -->
    <div class="flex items-center gap-4">
      <label class="font-medium">Select Month:</label>
      <select v-model="selectedMonth" class="border rounded-lg p-2">
        <option v-for="(m, index) in months" :key="index" :value="index">{{ m }}</option>
      </select>
      <select v-model="selectedYear" class="border rounded-lg p-2">
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
      </select>

      <button @click="saveAllStocks" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        Save All
      </button>
      <button @click="loadMonthStocks" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        Load Stocks
      </button>
    </div>

    <!-- Calendar Layout -->
    <div class="grid grid-cols-7 gap-2 text-center">
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

const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i)

// Map of date keys to stock objects
const dayStocks = ref<Record<string, TicketStock>>({})

// Helper to format Date as key
const dayKey = (date: Date): string => date.toISOString().split("T")[0]

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
      id: undefined,
      ticket_type_id: 1,
      date: key,
      total_quantity: defaultStock.value,
      sold_quantity: 0,
      modified_by: null,
      updated_at: new Date().toISOString(),
    }
  }
  return dayStocks.value[key]
}

// Load existing stocks for the month
const loadMonthStocks = async () => {
  await store.fetchStocks()
  monthDays.value.forEach(day => {
    const stock = store.stocks.find(s => s.date === dayKey(day))
    if (stock) dayStocks.value[dayKey(day)] = {...stock}
    else dayStocks.value[dayKey(day)] = { ticket_type_id: 1, date: dayKey(day), total_quantity: defaultStock.value, sold_quantity: 0 }
  })
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

// Save all stocks for the month
const saveAllStocks = async () => {
  for (const day of monthDays.value) {
    const stock = getDayStock(day)
    if (stock.id) await store.updateStock(stock.id, stock)
    else await store.createStock(stock)
  }
  alert('All stocks saved successfully!')
}

// Load initial stocks (initialize days)
onMounted(() => {
  monthDays.value.forEach(day => getDayStock(day))
})
</script>

<style scoped>
input {
  text-align: center;
}
</style>

