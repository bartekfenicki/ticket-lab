<template>
  <div class="max-w-4xl mx-auto p-8">
    <!-- Header -->
    <h1 class="text-3xl font-bold text-emerald-700 mb-6 text-center">
      🏕 Event Reservation
    </h1>
    <p class="text-gray-600 text-center mb-8">
      Select the type of event you’d like to organize and customize your package.
    </p>

    <!-- Event Type Tabs -->
    <div class="flex flex-wrap justify-center gap-4 mb-8">
      <button
        v-for="type in eventTypes"
        :key="type"
        @click="selectedType = type; resetSelections()"
        :class="[
          'px-4 py-2 rounded-lg font-semibold transition-colors',
          selectedType === type
            ? 'bg-emerald-600 text-white shadow-md'
            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
        ]"
      >
        {{ type }}
      </button>
    </div>

    <!-- Event Options -->
    <div v-if="selectedType" class="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-emerald-700 mb-4">
        {{ selectedType }} Options
      </h2>

      <div class="space-y-4">
        <label
          v-for="option in currentOptions"
          :key="option.name"
          class="flex justify-between items-center p-4 border rounded-lg hover:border-emerald-400 transition"
        >
          <div>
            <p class="font-medium text-gray-800">{{ option.name }}</p>
            <p class="text-sm text-gray-500">{{ option.description }}</p>
          </div>
          <div class="flex items-center gap-4">
            <p class="font-semibold text-emerald-700">
              {{ option.price }} zł / person
            </p>
            <input
              type="radio"
              v-model="selectedOption"
              :value="option"
              class="h-4 w-4 text-emerald-600"
            />
          </div>
        </label>
      </div>
    </div>

    <!-- Add-ons -->
    <div v-if="selectedOption" class="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-emerald-700 mb-4">Add-ons</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <label
          v-for="addon in addons"
          :key="addon.name"
          class="flex justify-between items-center p-4 border rounded-lg hover:border-emerald-400 transition"
        >
          <div>
            <p class="font-medium text-gray-800">{{ addon.name }}</p>
            <p class="text-sm text-gray-500">{{ addon.description }}</p>
          </div>
          <div class="flex items-center gap-4">
            <p class="font-semibold text-emerald-700">{{ addon.price }} zł</p>
            <input
              type="checkbox"
              v-model="selectedAddons"
              :value="addon"
              class="h-4 w-4 text-emerald-600"
            />
          </div>
        </label>
      </div>
    </div>

    <!-- People Count -->
    <div
      v-if="selectedOption"
      class="bg-white rounded-2xl shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <div>
        <h2 class="text-xl font-semibold text-emerald-700 mb-2">
          Number of Participants
        </h2>
        <p class="text-sm text-gray-500">
          Minimum {{ selectedOption.minPeople }} people required
        </p>
      </div>
      <input
        type="number"
        v-model.number="peopleCount"
        min="1"
        class="border rounded-lg p-2 w-24 text-center focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </div>

    <!-- Summary -->
    <div
      v-if="selectedOption"
      class="bg-emerald-50 rounded-2xl shadow-inner p-6"
    >
      <h2 class="text-xl font-semibold text-emerald-700 mb-4">Summary</h2>
      <p class="text-gray-700 mb-1">
        <strong>Event Type:</strong> {{ selectedType }}
      </p>
      <p class="text-gray-700 mb-1">
        <strong>Selected Option:</strong> {{ selectedOption.name }}
      </p>
      <p class="text-gray-700 mb-1">
        <strong>People:</strong> {{ peopleCount }}
      </p>
      <p class="text-gray-700 mb-2">
        <strong>Add-ons:</strong>
        <span v-if="selectedAddons.length">{{ selectedAddons.map(a => a.name).join(', ') }}</span>
        <span v-else>None</span>
      </p>
      <p class="text-lg font-bold text-emerald-700">
        💰 Total: {{ totalPrice }} zł
      </p>

      <div class="mt-6 text-right">
        <button
          @click="handleProceed"
          class="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
          Proceed to Reservation Details →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/* --- Define Types --- */
interface EventOption {
  name: string
  description: string
  price: number
  minPeople: number
}

interface Addon {
  name: string
  description: string
  price: number
}

/* --- Reactive State --- */
const eventTypes = ['Birthday', 'Company Event', 'Organized Group', 'Other Event'] as const
type EventType = typeof eventTypes[number]

const selectedType = ref<EventType | null>(null)
const selectedOption = ref<EventOption | null>(null)
const selectedAddons = ref<Addon[]>([])
const peopleCount = ref<number>(10)

const emit = defineEmits(['proceed'])

const numberOfPeople = ref<number>(10)

const resetSelections = () => {
  selectedOption.value = null
  selectedAddons.value = []
  peopleCount.value = 10
}

/* --- Event Data --- */
const eventData: Record<EventType, EventOption[]> = {
  Birthday: [
    {
      name: 'Birthday with Bonfire',
      description: 'Playtime + ready bonfire food + drinks included.',
      price: 90,
      minPeople: 10,
    },
    {
      name: 'Birthday with Menu',
      description: 'Playtime + colorful birthday menu + drinks.',
      price: 140,
      minPeople: 10,
    },
    {
      name: 'Birthday (Own Food)',
      description: 'You bring your own food and drinks.',
      price: 75,
      minPeople: 10,
    },
  ],
  'Company Event': [
    { name: 'Standard Package', description: '4h event with bonfire & labyrinth access.', price: 75, minPeople: 10 },
    { name: 'With Menu', description: 'Includes meal and drinks during the event.', price: 90, minPeople: 10 },
    { name: 'Exclusive Access', description: 'Full venue rental (up to 200 people).', price: 15000, minPeople: 10 },
  ],
  'Organized Group': [
    { name: 'Labyrinth Only', description: 'Access to labyrinth only.', price: 45, minPeople: 10 },
    { name: 'Labyrinth + Picnic', description: 'Access + picnic area with own food.', price: 75, minPeople: 10 },
    { name: 'Labyrinth + Bonfire Meal', description: 'Full labyrinth + bonfire meal package.', price: 90, minPeople: 10 },
  ],
  'Other Event': [
    { name: 'Standard Package', description: '4h with own catering & labyrinth fun.', price: 75, minPeople: 10 },
    { name: 'With Bonfire Meal', description: 'Includes bonfire meal & drinks.', price: 90, minPeople: 10 },
    { name: 'Full-Day Exclusive Rental', description: '8h private venue rental.', price: 12000, minPeople: 10 },
  ],
}

/* --- Shared Add-ons --- */
const addons: Addon[] = [
  { name: 'Fruit Platters', price: 120, description: 'Seasonal fruits beautifully served.' },
  { name: 'Vegetable Mix with Dips', price: 35, description: 'Veggies with garlic & hummus dips.' },
  { name: 'Dry Snacks', price: 8, description: 'Pretzels, crackers, popcorn (per person).' },
  { name: 'Cheese & Meat Board', price: 129, description: 'Premium cheeses & meats per kg.' },
  { name: 'Cakes', price: 15, description: 'Choice of apple pie, brownie or cheesecake.' },
  { name: 'Extra Bonfire Pack', price: 35, description: 'Additional sausage packs for adults.' },
  { name: 'Lemonade Jug (1L)', price: 27, description: 'Freshly squeezed lemonade jug.' },
  { name: 'Water (5L)', price: 25, description: 'Still water 5L bottle.' },
]

/* --- Computed Logic --- */
const currentOptions = computed<EventOption[]>(() =>
  selectedType.value ? eventData[selectedType.value] : []
)

const totalPrice = computed<number>(() => {
  if (!selectedOption.value) return 0
  const base = selectedOption.value.price
  const addonsTotal = selectedAddons.value.reduce((sum, a) => sum + a.price, 0)
  return base * peopleCount.value + addonsTotal
})

/* --- Navigation --- */
const handleProceed = () => {
  if (!selectedOption.value || numberOfPeople.value < 10) {
    alert('Please select an option and ensure at least 10 participants.')
    return
  }

  emit('proceed', {
    type: selectedType.value,
    option: selectedOption.value.name,
    people: numberOfPeople.value,
    addons: selectedAddons.value.map((a) => a.name),
    total: totalPrice.value,
  })
}
</script>


<style scoped>
</style>
