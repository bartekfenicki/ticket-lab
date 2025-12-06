<template>
  <div class="bg-white p-6 rounded-xl shadow">
    <h2 class="text-2xl font-bold mb-4">Manage Closed Days</h2>

    <!-- MONTH NAVIGATION -->
    <div class="flex items-center justify-between mb-4">
      <button @click="prevMonth" class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
        ‹
      </button>

      <h3 class="text-xl font-semibold">
        {{ monthNames[currentMonth] }} {{ currentYear }}
      </h3>

      <button @click="nextMonth" class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
        ›
      </button>
    </div>

    <!-- CALENDAR GRID -->
    <div class="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2">
      <div v-for="d in weekDays" :key="d">{{ d }}</div>
    </div>

    <div class="grid grid-cols-7 gap-1 text-center">
      <div v-for="n in firstDayOfMonth" :key="'empty-'+n"></div>

      <button
        v-for="day in daysInMonth"
        :key="day"
        @click="selectDate(day)"
        class="relative p-2 rounded-lg transition"
        :class="[
          'hover:bg-blue-100',
          isSelected(day) ? 'bg-blue-500 text-white font-bold' : '',
          isClosedDay(day) ? 'border border-red-600' : 'border border-transparent'
        ]"
      >
        {{ day }}

        <!-- RED DOT FOR CLOSED DAY -->
        <span
          v-if="isClosedDay(day)"
          class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full"
        ></span>
      </button>
    </div>

    <!-- SELECTED DAY PANEL -->
    <div v-if="selectedDate" class="mt-6 p-4 bg-gray-50 rounded-lg border">
      <h3 class="text-lg font-semibold">
        {{ selectedDateLabel }}
      </h3>

      <div v-if="selectedClosedDay" class="mt-3">
        <p class="text-red-600 font-semibold">
          This day is CLOSED
        </p>
        <p class="text-gray-600 mb-3">Reason: {{ selectedClosedDay.reason }}</p>

        <button
          @click="deleteSelected"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Closed Day
        </button>
      </div>

      <div v-else class="mt-3">
        <label class="block text-sm font-medium mb-1">Reason for closing:</label>
        <input
          v-model="reason"
          type="text"
          class="w-full px-3 py-2 border rounded-lg mb-3"
          placeholder="Example: Holiday, maintenance, event..."
        />

        <button
          @click="createClosed"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Mark as Closed
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useClosedDaysStore } from "@/stores/closedDaysStore";

// STORES
const closedDaysStore = useClosedDaysStore();

// CALENDAR STATE
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const selectedDate = ref<Date | null>(null);
const reason = ref("");

// LOAD DATA
onMounted(() => {
  closedDaysStore.fetchClosedDays();
});

// CALENDAR HELPERS
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const daysInMonth = computed(() =>
  new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
);

const firstDayOfMonth = computed(() =>
  new Date(currentYear.value, currentMonth.value, 1).getDay()
);

// SELECT DATE
const selectDate = (day: number) => {
  selectedDate.value = new Date(currentYear.value, currentMonth.value, day);
  reason.value = "";
};

// LABEL
const selectedDateLabel = computed(() => {
  if (!selectedDate.value) return "";
  const d = selectedDate.value;
  return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
});

// FORMAT YYYY-MM-DD
const pad = (n: number) => String(n).padStart(2, "0");
const formatDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// CHECK CLOSED DAY
const normalize = (iso: string) => iso.slice(0, 10); // ← removes time / timezone

const closedDaysMap = computed(() => {
  const map: Record<string, any> = {};
  closedDaysStore.closedDays.forEach(cd => {
    const key = normalize(cd.date);
    map[key] = cd;
  });
  return map;
});

const isClosedDay = (day: number) => {
  const d = new Date(currentYear.value, currentMonth.value, day);
  const key = d.toISOString().slice(0, 10); // normalized
  return Boolean(closedDaysMap.value[key]);
};

// SELECTED CLOSED DAY
const selectedClosedDay = computed(() => {
  if (!selectedDate.value) return null;
  return closedDaysMap.value[selectedDate.value.toISOString().slice(0, 10)] || null;
});

// CREATE CLOSED DAY
const createClosed = async () => {
  if (!selectedDate.value || !reason.value.trim()) return;

  await closedDaysStore.createClosedDay({
    date: formatDate(selectedDate.value),
    reason: reason.value,
    created_by: 1 // you can change later based on auth
  });

  reason.value = "";
};

// DELETE CLOSED DAY
const deleteSelected = async () => {
  if (!selectedClosedDay.value) return;

  await closedDaysStore.deleteClosedDay(selectedClosedDay.value.id);
};

// MONTH NAV
const prevMonth = () => {
  currentMonth.value--;
  if (currentMonth.value < 0) {
    currentMonth.value = 11;
    currentYear.value--;
  }
};

const nextMonth = () => {
  currentMonth.value++;
  if (currentMonth.value > 11) {
    currentMonth.value = 0;
    currentYear.value++;
  }
};

// UI HELPERS
const isSelected = (day: number) => {
  if (!selectedDate.value) return false;
  return (
    selectedDate.value.getDate() === day &&
    selectedDate.value.getMonth() === currentMonth.value &&
    selectedDate.value.getYear() === currentYear.value - 1900
  );
};
</script>

<style scoped>
button {
  user-select: none;
}
</style>
