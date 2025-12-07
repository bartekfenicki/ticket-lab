<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md">
    <h1 class="text-2xl text-green-700 font-bold mb-4">Email Logs</h1>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center">
      <!-- Type Filter -->
      <select v-model="selectedType" class="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400">
        <option value="">All Types</option>
        <option value="reservation">Reservation</option>
        <option value="ticket">Ticket</option>
      </select>

      <!-- Date Filter -->
      <input
        type="date"
        v-model="selectedDate"
        class="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        placeholder="Filter by date"
      />

      <!-- Subject Search -->
      <input
        type="text"
        v-model="searchSubject"
        class="px-3 py-2 border rounded-lg flex-1 focus:outline-none focus:ring focus:border-blue-400"
        placeholder="Search by subject"
      />

      <!-- Refresh Button -->
      <button
        @click="fetchLogs"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Refresh
      </button>
    </div>

    <!-- Table -->
    <!-- Table Wrapper for Scroll -->
     <div v-if="loading" class="text-gray-500">Loading email logs...</div>
    <div v-else class="overflow-x-auto w-full border rounded-lg shadow-sm">
      <table class="min-w-[700px] w-full border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 border-b text-left">ID</th>
            <th class="p-3 border-b text-left">Email</th>
            <th class="p-3 border-b text-left">Subject</th>
            <th class="p-3 border-b text-left">Type</th>
            <th class="p-3 border-b text-left">Sent At</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="log in filteredLogs"
            :key="log.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="p-3 border-b">{{ log.id }}</td>
            <td class="p-3 border-b">{{ log.email }}</td>
            <td class="p-3 border-b">{{ log.subject }}</td>
            <td class="p-3 border-b capitalize">{{ log.type }}</td>
            <td class="p-3 border-b">{{ formatDate(log.sent_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredLogs.length === 0" class="mt-4 text-gray-400 text-center">
      No logs match the filters.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useEmailLogsStore, type EmailLog } from "@/stores/emailsLogStore";

const emailLogsStore = useEmailLogsStore();

// Filters
const selectedType = ref<string>("");
const selectedDate = ref<string>("");
const searchSubject = ref<string>("");

const fetchLogs = async () => {
  await emailLogsStore.fetchEmailLogs();
};

onMounted(fetchLogs);

const loading = computed(() => emailLogsStore.loading);

// Computed: filtered logs
const filteredLogs = computed(() => {
  return emailLogsStore.emailLogs.filter((log: EmailLog) => {
    // Filter by type
    if (selectedType.value && log.type !== selectedType.value) return false;

    // Filter by date (YYYY-MM-DD)
    if (selectedDate.value) {
      const logDate = new Date(log.sent_at).toISOString().slice(0, 10);
      if (logDate !== selectedDate.value) return false;
    }

    // Filter by subject search (case-insensitive)
    if (searchSubject.value) {
      const subject = log.subject.toLowerCase();
      const search = searchSubject.value.toLowerCase();
      if (!subject.includes(search)) return false;
    }

    return true;
  });
});

// Format timestamp
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
table th, table td {
  text-align: left;
}
</style>
