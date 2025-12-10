<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-8">
    <h2 class="text-xl sm:text-2xl font-bold text-indgreenigo-700">Ticket Types Management</h2>

    <!-- Add Ticket Type Form -->
    <form @submit.prevent="addTicketType" class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border-b pb-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input v-model="newTicket.name" type="text" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <input v-model.number="newTicket.price" type="number" min="0" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500" required />
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea v-model="newTicket.description" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500" rows="2"></textarea>
      </div>
      <div class="flex gap-4 items-center">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="newTicket.is_special_event" class="accent-green-600 w-5 h-5"/>
          Special Event
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="newTicket.active" class="accent-green-600 w-5 h-5"/>
          Active
        </label>
      </div>
      <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition">Add Ticket Type</button>
    </form>

    <!-- Ticket Types Table -->
    <div class="overflow-x-auto">
  <!-- Desktop / Tablet Table -->
  <table class="min-w-full border border-gray-200 rounded-lg hidden md:table">
    <thead class="bg-indigo-50 text-gray-700">
      <tr>
        <th class="py-3 px-4 text-left">Name</th>
        <th class="py-3 px-4 text-left">Price</th>
        <th class="py-3 px-4 text-left">Description</th>
        <th class="py-3 px-4 text-center">Special Event</th>
        <th class="py-3 px-4 text-center">Active</th>
        <th class="py-3 px-4 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="ticket in ticketStore.ticketTypes" :key="ticket.id" class="border-b hover:bg-gray-50">
        <td class="py-2 px-4">
          <input v-model="ticket.name" class="border rounded-md p-1 w-full focus:ring-2 focus:ring-indigo-500"/>
        </td>
        <td class="py-2 px-4">
          <input v-model.number="ticket.price" type="number" min="0" class="border rounded-md p-1 w-full focus:ring-2 focus:ring-indigo-500"/>
        </td>
        <td class="py-2 px-4">
          <input v-model="ticket.description" class="border rounded-md p-1 w-full focus:ring-2 focus:ring-indigo-500"/>
        </td>
        <td class="py-2 px-4 text-center">
          <input type="checkbox" v-model="ticket.is_special_event" class="accent-indigo-600 w-4 h-4"/>
        </td>
        <td class="py-2 px-4 text-center">
          <input type="checkbox" v-model="ticket.active" class="accent-indigo-600 w-4 h-4"/>
        </td>
        <td class="py-2 px-4 flex justify-center gap-2">
          <button @click="updateTicket(ticket)" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition">Save</button>
          <button @click="deleteTicket(ticket.id!)" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Mobile / Small Screens -->
  <div class="md:hidden space-y-4">
    <div v-for="ticket in ticketStore.ticketTypes" :key="ticket.id" class="border rounded-lg p-3 bg-white shadow-sm space-y-2">
      <div class="flex justify-between items-center">
        <span class="font-semibold text-gray-700">Name:</span>
        <input v-model="ticket.name" class="border rounded-md p-1 w-2/3 focus:ring-2 focus:ring-indigo-500"/>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-semibold text-gray-700">Price:</span>
        <input v-model.number="ticket.price" type="number" min="0" class="border rounded-md p-1 w-2/3 focus:ring-2 focus:ring-indigo-500"/>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-semibold text-gray-700">Description:</span>
        <input v-model="ticket.description" class="border rounded-md p-1 w-2/3 focus:ring-2 focus:ring-indigo-500"/>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-semibold text-gray-700">Special Event:</span>
        <input type="checkbox" v-model="ticket.is_special_event" class="accent-indigo-600 w-4 h-4"/>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-semibold text-gray-700">Active:</span>
        <input type="checkbox" v-model="ticket.active" class="accent-indigo-600 w-4 h-4"/>
      </div>
      <div class="flex justify-end gap-2">
        <button @click="updateTicket(ticket)" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition">Save</button>
        <button @click="deleteTicket(ticket.id!)" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition">Delete</button>
      </div>
    </div>
  </div>
</div>

    <!-- Loading/Error States -->
    <div v-if="ticketStore.loading" class="text-center text-gray-500">Loading...</div>
    <div v-if="ticketStore.error" class="text-center text-red-500">{{ ticketStore.error }}</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useTicketTypeStore } from "@/stores/ticketTypesStore";
import type { TicketType } from "@/stores/ticketTypesStore";

const ticketStore = useTicketTypeStore();

const newTicket = reactive<Omit<TicketType, "id">>({
  name: "",
  price: 0,
  description: "",
  is_special_event: false,
  active: true,
});

onMounted(() => {
  ticketStore.fetchTicketTypes();
});

const addTicketType = async () => {
  await ticketStore.createTicketType(newTicket);
  newTicket.name = "";
  newTicket.price = 0;
  newTicket.description = "";
  newTicket.is_special_event = false;
  newTicket.active = true;
};

const updateTicket = async (ticket: TicketType) => {
  if (!ticket.id) return;
  await ticketStore.updateTicketType(ticket.id, ticket);
};

const deleteTicket = async (id: number) => {
  await ticketStore.deleteTicketType(id);
};
</script>

<style scoped>
table input[type="text"], table input[type="number"] {
  background-color: transparent;
}
</style>
