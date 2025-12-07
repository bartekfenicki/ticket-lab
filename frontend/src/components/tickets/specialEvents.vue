<template>
  <div class="p-6 bg-white shadow-md rounded-xl space-y-6">

    <h2 class="text-2xl font-semibold text-green-700">Special Events Manager</h2>

    <!-- Create Event Button -->
    <button
      @click="openForm()"
      class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
    >
      Create New Event
    </button>

    <!-- Events Table (responsive) -->
    <div class="overflow-x-auto hidden md:block mt-4">
      <table class="w-full border-collapse border border-gray-300 min-w-[600px]">
        <thead class="bg-gray-50">
          <tr>
            <th class="border px-4 py-2 text-left">Title</th>
            <th class="border px-4 py-2 text-left">Description</th>
            <th class="border px-4 py-2 text-left">Date</th>
            <th class="border px-4 py-2 text-center">Ticket Type</th>
            <th class="border px-4 py-2 text-center">Max Tickets</th>
            <th class="border px-4 py-2 text-center">Active</th>
            <th class="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in store.events" :key="event.id" class="border-b hover:bg-gray-50">
            <td class="border px-4 py-2">{{ event.title }}</td>
            <td class="border px-4 py-2">{{ event.description }}</td>
            <td class="border px-4 py-2">{{ formatDate(event.date) }}</td>
            <td class="border px-4 py-2 text-center">{{ getTicketTypeName(event.ticket_type_id) }}</td>
            <td class="border px-4 py-2 text-center">{{ event.max_tickets }}</td>
            <td class="border px-4 py-2 text-center">{{ event.active ? 'Yes' : 'No' }}</td>
            <td class="border px-4 py-2 flex gap-2 justify-center">
              <button
                @click="openForm(event)"
                class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                @click="removeEvent(event.id!)"
                class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card Layout -->
    <div class="md:hidden grid gap-3 mt-4">
      <div v-for="event in store.events" :key="'mobile-'+event.id" class="border rounded-lg p-4 bg-gray-50 shadow-sm">
        <div class="flex justify-between mb-2">
          <span class="font-semibold">Title:</span> <span>{{ event.title }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-semibold">Date:</span> <span>{{ formatDate(event.date) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-semibold">Ticket Type:</span> <span>{{ getTicketTypeName(event.ticket_type_id) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-semibold">Max Tickets:</span> <span>{{ event.max_tickets }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-semibold">Active:</span> <span>{{ event.active ? 'Yes' : 'No' }}</span>
        </div>
        <div class="flex gap-2 justify-end mt-2">
          <button @click="openForm(event)" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
          <button @click="removeEvent(event.id!)" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <transition name="fade">
      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      >
        <div class="bg-white p-6 rounded-xl w-full max-w-md mx-auto space-y-4">
          <h3 class="text-xl font-semibold text-indigo-700">{{ editingEvent ? 'Edit Event' : 'Create Event' }}</h3>

          <input v-model="form.title" type="text" placeholder="Title" class="w-full border rounded-lg p-2"/>
          <textarea v-model="form.description" placeholder="Description" class="w-full border rounded-lg p-2"></textarea>
          <input v-model="form.date" type="date" class="w-full border rounded-lg p-2"/>

          <label class="block font-medium">Select Ticket Type</label>
          <select v-model="form.ticket_type_id" class="w-full border rounded-lg p-2">
            <option v-for="type in specialTicketTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
          </select>

          <input v-model.number="form.max_tickets" type="number" placeholder="Max Tickets" class="w-full border rounded-lg p-2"/>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="form.active" class="accent-indigo-600"/>
            Active
          </label>

          <div class="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <button @click="submitForm" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              {{ editingEvent ? 'Update' : 'Create' }}
            </button>
            <button @click="closeForm" class="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      </div>
    </transition>

    <p v-if="store.loading" class="text-center text-gray-500">Loading...</p>
    <p v-if="store.error" class="text-center text-red-600">{{ store.error }}</p>
  </div>
</template>


<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useSpecialEventsStore, type SpecialEvent } from '@/stores/specialEventsStore'
import { useTicketTypeStore } from '@/stores/ticketTypesStore'

const store = useSpecialEventsStore()
const ticketTypeStore = useTicketTypeStore()
const showForm = ref(false)
const editingEvent = ref<SpecialEvent | null>(null)

const form = reactive<SpecialEvent>({
  title: '',
  description: '',
  date: '',
  ticket_type_id: 0,
  max_tickets: 0,
  active: true,
})

// Load events & ticket types initially
onMounted(async () => {
  await store.fetchEvents()
  await ticketTypeStore.fetchTicketTypes()
})

// Only ticket types marked as special events
const specialTicketTypes = computed(() =>
  ticketTypeStore.ticketTypes.filter(type => type.is_special_event)
)

// Helpers
const formatDate = (date: string) => {
  const [y, m, d] = date.split("-")
  return `${d}.${m}.${y}`
}
const getTicketTypeName = (id: number) =>
  ticketTypeStore.ticketTypes.find(type => type.id === id)?.name || 'Unknown'

const openForm = (event?: SpecialEvent) => {
  if (event) {
    editingEvent.value = event
    Object.assign(form, event)
  } else {
    editingEvent.value = null
    form.title = ''
    form.description = ''
    form.date = ''
    form.ticket_type_id = specialTicketTypes.value.length ? specialTicketTypes.value[0].id : 0
    form.max_tickets = 0
    form.active = true
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

const submitForm = async () => {
  if (editingEvent.value) {
    await store.updateEvent(editingEvent.value.id!, { ...form })
  } else {
    await store.createEvent({ ...form })
  }
  showForm.value = false
}

const removeEvent = async (id: number) => {
  if (confirm('Are you sure you want to delete this event?')) {
    await store.deleteEvent(id)
  }
}
</script>

<style scoped>
textarea {
  resize: vertical;
}
</style>
