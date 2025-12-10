<template>
  <div class="p-8 max-w-6xl mx-auto">
    <!-- Title -->
    <h1 class="text-2xl md:text-3xl font-bold text-green-700 mb-6">
      Sales & Revenue Dashboard
    </h1>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-white p-4 shadow rounded-xl border">
        <h3 class="font-semibold text-gray-600">Total Revenue</h3>
        <p class="text-2xl font-bold text-green-600">{{ totalRevenue }} PLN</p>
      </div>

      <div class="bg-white p-4 shadow rounded-xl border">
        <h3 class="font-semibold text-gray-600">Paid Reservations</h3>
        <p class="text-2xl font-bold text-yellow-600">
          {{ stats.paidReservations.length }}
        </p>
      </div>

      <div class="bg-white p-4 shadow rounded-xl border">
        <h3 class="font-semibold text-gray-600">Selected Month Revenue</h3>
        <p class="text-2xl font-bold text-yellow-800">
          {{ selectedMonthRevenue }} PLN
        </p>
      </div>
    </div>

    <!-- Month Selector -->
    <div class="mb-6">
      <label class="font-semibold mr-2">Choose Month:</label>
      <select v-model="selectedMonth" class="border rounded-lg px-3 py-2">
        <option v-for="m in months" :key="m" :value="m">
          {{ m }}
        </option>
      </select>
    </div>

    <!-- Monthly Revenue Chart -->
    <div class="bg-white p-6 shadow rounded-xl mb-10 border">
      <h2 class="text-lg font-bold mb-3">Revenue by Month</h2>
      <BarChart :chart-data="chartMonthData" :options="chartOptions" />
    </div>

    <!-- Monthly Reservation Count Chart -->
    <div class="bg-white p-6 shadow rounded-xl mb-10 border">
      <h2 class="text-lg font-bold mb-3">Paid Reservations per Month</h2>
      <BarChart :chart-data="chartReservationCountData" :options="chartOptions" />
    </div>

    <!-- Daily Revenue Chart -->
    <div class="bg-white p-6 shadow rounded-xl border">
      <h2 class="text-lg font-bold mb-3">
        Revenue for {{ selectedMonth }}
      </h2>
      <LineChart :chart-data="chartDayData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { BarChart, LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

import { useStatisticsStore } from "@/stores/reservationStatsStore";
import { useReservationStore } from "@/stores/reservationStore";

const stats = useStatisticsStore();
const reservationStore = useReservationStore();

onMounted(async () => {
  await reservationStore.getAllReservations();
  stats.loadStats();
});

const months = computed(() => Object.keys(stats.revenueByMonth));

const selectedMonth = ref("");

watch(months, list => {
  if (list.length > 0 && !selectedMonth.value) {
    selectedMonth.value = list[list.length - 1] ?? "";
  }
});

const chartMonthData = computed(() => ({
  labels: Object.keys(stats.revenueByMonth),
  datasets: [
    {
      label: "Revenue (PLN)",
      data: Object.values(stats.revenueByMonth),
      backgroundColor: "rgba(99, 102, 241, 0.6)"
    }
  ]
}));


const chartReservationCountData = computed(() => {
  // Count paid reservations per month
  const countMap: Record<string, number> = {};

  stats.paidReservations.forEach((r) => {
    const month = r.date.slice(0, 7);
    countMap[month] = (countMap[month] || 0) + 1;
  });

  return {
    labels: Object.keys(countMap),
    datasets: [
      {
        label: "Paid Reservations",
        data: Object.values(countMap),
        backgroundColor: "rgba(16, 185, 129, 0.6)"
      }
    ]
  };
});


const selectedMonthRevenueMap = computed(() => {
  const result: Record<string, number> = {};
  Object.entries(stats.revenueByDay).forEach(([day, value]) => {
    if (day.startsWith(selectedMonth.value)) {
      result[day] = value;
    }
  });
  return result;
});

const selectedMonthRevenue = computed(() => {
  return Object.values(selectedMonthRevenueMap.value).reduce(
    (sum, v) => sum + v,
    0
  );
});

const chartDayData = computed(() => ({
  labels: Object.keys(selectedMonthRevenueMap.value),
  datasets: [
    {
      label: "Daily Revenue (PLN)",
      data: Object.values(selectedMonthRevenueMap.value),
      borderWidth: 2,
      tension: 0.3
    }
  ]
}));

const chartOptions = { responsive: true };

const totalRevenue = computed(() => stats.totalRevenue);
</script>
