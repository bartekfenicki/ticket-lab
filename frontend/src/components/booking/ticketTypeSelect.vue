<template>
  <div class="bg-white shadow-md rounded-xl p-6">
    <h2 class="text-2xl font-semibold text-indigo-700 mb-4">🎟 Ticket Selection</h2>
    <p class="text-gray-600 mb-6">
      Choose your ticket types and quantities below.
    </p>

    <!-- Ticket table -->
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-indigo-50 text-gray-700">
          <th class="py-3 px-4 text-left rounded-tl-lg">Ticket Type</th>
          <th class="py-3 px-4 text-left">Description</th>
          <th class="py-3 px-4 text-left">Price (PLN)</th>
          <th class="py-3 px-4 text-center rounded-tr-lg">Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ticket in tickets"
          :key="ticket.name"
          class="border-b hover:bg-gray-50 transition-colors"
        >
          <td class="py-3 px-4 font-medium text-gray-800">{{ ticket.name }}</td>
          <td class="py-3 px-4 text-gray-600">{{ ticket.description }}</td>
          <td class="py-3 px-4 text-gray-800 font-semibold">{{ ticket.price }} zł</td>
          <td class="py-3 px-4 text-center">
            <input
              type="number"
              min="0"
              v-model.number="ticket.quantity"
              class="w-16 text-center border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Notes -->
    <div class="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg text-sm text-gray-700">
      <p class="font-semibold mb-1">Discount and Entry Rules:</p>
      <ul class="list-disc ml-5 space-y-1">
        <li>
          <strong>Discount ticket</strong> (zniżkowy) available with valid documents:
          <ul class="ml-4 list-disc">
            <li>Large Family Card (Karta Dużej Rodziny)</li>
            <li>Warsaw Resident Card</li>
            <li>Teacher’s Card</li>
            <li>Resident Card of Pruszków, Brwinów, Podkowa Leśna, Grodzisk Maz.</li>
          </ul>
        </li>
        <li>
          <strong>Reduced ticket</strong> (ulgowy) — for students and pupils with ID.
        </li>
        <li>
          <strong>Children under 13</strong> must be accompanied by adults (due to
          past material damage). Not applicable for organized groups.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, defineEmits, watch } from 'vue'

interface Ticket {
  name: string
  description: string
  price: number
  quantity: number
}

const emit = defineEmits<{
  (e: 'update:tickets', value: Ticket[]): void
}>()

const tickets = reactive<Ticket[]>([
  {
    name: 'Discounted',
    description: 'For eligible individuals with valid ID (see rules below).',
    price: 40,
    quantity: 0,
  },
  {
    name: 'Reduced',
    description: 'For students and pupils with valid student ID.',
    price: 45,
    quantity: 0,
  },
  {
    name: 'Regular',
    description: 'Standard entry for the whole day, unlimited puzzles.',
    price: 50,
    quantity: 0,
  },
])



// Emit whenever ticket quantities change
watch(
  tickets,
  () => {
    emit('update:tickets', tickets)
  },
  { deep: true }
)
</script>
