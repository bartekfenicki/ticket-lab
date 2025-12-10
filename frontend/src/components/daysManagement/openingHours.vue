<template>
  <div class="max-w-full mx-auto p-6 bg-white rounded-xl shadow">
    <h2 class="text-2xl font-bold mb-6">Manage Opening Hours</h2>

    <div v-if="store.loading" class="text-gray-500 mb-4">Loading...</div>
    <div v-if="store.error" class="text-red-500 mb-4">{{ store.error }}</div>

    <div v-for="day in daysOfWeek" :key="day" class="flex items-center justify-between mb-4 p-3 border rounded-lg shadow-sm overflow-x-auto">
      <div class="font-medium capitalize">{{ day }}</div>

      <div class="flex items-center space-x-2">
        <input
          type="time"
          v-model="form[day]!.open_time"
          class="border px-2 py-1 rounded"
        />
        <span>-</span>
        <input
          type="time"
          v-model="form[day]!.close_time"
          class="border px-2 py-1 rounded"
        />

        <input
          type="checkbox"
          v-model="form[day]!.active"
          class="ml-2"
          title="Active"
        />

        <button
          @click="saveDay(day)"
          class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save
        </button>

        <div v-if="store.byDay[day]" class="mt-1 w-2 h-2 rounded-full bg-green-500"></div>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useOpeningHoursStore } from "@/stores/openingHoursStore";

const store = useOpeningHoursStore();

const daysOfWeek = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

const form = reactive<Record<string, { open_time: string; close_time: string; active: boolean }>>({});

daysOfWeek.forEach(day => {
  form[day] = {
    open_time: "09:00",
    close_time: "17:00",
    active: true,
  };
});

onMounted(async () => {
  await store.fetchOpeningHours();
  daysOfWeek.forEach(day => {
    const existing = store.byDay[day];
    if (existing) {
      form[day]!.open_time = existing.open_time;
      form[day]!.close_time = existing.close_time;
      form[day]!.active = existing.active;
    }
  });
});

const saveDay = async (day: string) => {
  const payload = {
    day_of_week: day,
    open_time: form[day]!.open_time,
    close_time: form[day]!.close_time,
    active: form[day!]!.active,
  };

  if (store.byDay[day]) {

    await store.updateOpeningHour(store.byDay[day].id!, payload);
  } else {

    await store.createOpeningHour(payload);
  }
};

</script>

<style scoped>
input[type="time"] {
  width: 90px;
}
</style>
