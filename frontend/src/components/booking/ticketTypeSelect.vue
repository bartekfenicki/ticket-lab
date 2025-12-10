<template>
  <div class="space-y-6">

    <!-- EVENT TICKETS -->
    <div v-if="eventForDay" class="bg-red-50 border border-red-300 p-4 rounded-lg">
      <h3 class="text-xl font-semibold text-red-700 mb-3">
        🎉 Special Event: {{ eventForDay.title }}
      </h3>

      <div class="space-y-4">
        <div
          v-for="type in eventTicketTypes"
          :key="'event-' + type.id"
          class="p-4 border rounded-lg flex justify-between items-center bg-white"
        >
          <div>
            <p class="font-semibold text-gray-800">{{ type.name }}</p>
            <p class="text-gray-500 text-sm">{{ type.description }}</p>
            <p class="text-green-700 font-bold mt-1">{{ type.price }} zł</p>
          </div>

          <input
            type="number"
            min="0"
            class="w-20 border rounded p-2 text-center"
            v-model.number="ticketSelection[type.id]"
          />
        </div>
      </div>
    </div>

    <!-- NORMAL TICKETS -->
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-green-700">Normal Tickets</h3>

      <div
        v-for="type in regularTicketTypes"
        :key="'normal-' + type.id"
        class="p-4 border rounded-lg flex justify-between items-center"
      >
        <div>
          <p class="font-semibold">{{ type.name }}</p>
          <p class="text-sm text-gray-500">{{ type.description }}</p>
          <p class="text-green-600 font-bold mt-1">{{ type.price }} zł</p>
        </div>

       <input
          type="number"
          min="0"
          class="w-20 border rounded p-2 text-center"
          :value="ticketSelection[type.id] ?? 0"
          @input="ticketSelection[type.id] = Number($event.target.value)"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTicketTypeStore } from '@/stores/ticketTypesStore'
import { useTicketStockStore } from '@/stores/ticketStockStore'
import { useSpecialEventsStore } from '@/stores/specialEventsStore'

const props = defineProps<{
  date: string
  modelValue: any[]
}>()

const emit = defineEmits(['update:modelValue'])

const ticketStore = useTicketTypeStore()
const stockStore = useTicketStockStore()
const eventStore = useSpecialEventsStore()

const ticketSelection = ref<Record<number, number>>({})

onMounted(async () => {
  await ticketStore.fetchTicketTypes()
  await eventStore.fetchEvents()
  await stockStore.fetchStockByDate(props.date)

  ticketSelection.value = {}
})

const eventForDay = computed(() =>
  eventStore.events.find(e => e.date === props.date)
)

const eventTicketTypes = computed(() => {
  if (!eventForDay.value) return []
  return ticketStore.ticketTypes.filter(t => t.id === eventForDay.value.ticket_type_id)
})

const regularTicketTypes = computed(() =>
  ticketStore.ticketTypes.filter(t => !t.is_special_event)
)

const stockForDay = computed(() => stockStore.stockForSelectedDate || {})

watch(ticketSelection, (val) => {
  const result: any[] = []

  for (const id in val) {
    const qty = val[id]
    if (qty <= 0) continue

    const type = ticketStore.ticketTypes.find(t => t.id == id)
    if (!type) continue

    result.push({
      id: type.id,
      name: type.name,
      price: type.price,
      quantity: qty,
      isEvent: !!type.is_special_event
    })
  }

  emit('update:modelValue', result)
}, { deep: true })
</script>


