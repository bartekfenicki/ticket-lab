<template>
  <div class="max-w-md p-2">

    <div v-if="loading" class="text-gray-500">Loading data, Please wait...</div>

    <div v-else>
      <div v-if="todayOpeningHour">
        <p class="text-gray-700 text-xs md:text-md font-medium">
          <span class="capitalize">{{ todayOpeningHour.day_of_week }}</span>:
        <span class="text-green-600 font-semibold">
          {{ formatTime(todayOpeningHour.open_time) }} - {{ formatTime(todayOpeningHour.close_time) }}
        </span>
        </p>
      </div>

      <div v-else class="text-gray-500 font-medium">
        Closed today
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useOpeningHoursStore, type OpeningHour } from "@/stores/openingHoursStore";

const openingHoursStore = useOpeningHoursStore();

onMounted(() => {
  openingHoursStore.fetchOpeningHours();
});

const dayNames = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

const todayDayString = computed(() => {
  const today = new Date();
  return dayNames[today.getDay()];
});

const todayOpeningHour = computed<OpeningHour | null>(() => {
  return openingHoursStore.openingHours.find(
    (oh) => oh.day_of_week.toLowerCase() === todayDayString.value && oh.active
  ) || null;
});

const formatTime = (time: string) => {
  const d = new Date(`1970-01-01T${time}`);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const loading = computed(() => openingHoursStore.loading);


</script>

