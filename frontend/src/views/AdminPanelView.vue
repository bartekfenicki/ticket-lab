<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Dashboard Header -->
      <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <!-- Tabs -->
      <div class="flex space-x-4 border-b mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="currentTab = tab.key"
          :class="[
            'px-4 py-2 font-medium border-b-2 transition',
            currentTab === tab.key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-blue-500'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="bg-white shadow rounded-lg p-6">
        <component :is="currentTabComponent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import UsersTab from "@/components/admin/addUsers.vue"
import TicketsTab from "@/components/admin/manageTickets.vue"

// Tabs definition
const tabs = [
  { key: "users", label: "Users", component: UsersTab },
  {key: "tickets", label: "Tickets", component: TicketsTab }
]

const currentTab = ref("events")

// Dynamically resolve component
const currentTabComponent = computed(() => {
  return tabs.find((t) => t.key === currentTab.value)?.component || UsersTab
})
</script>
