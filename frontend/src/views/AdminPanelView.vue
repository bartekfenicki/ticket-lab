<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Dashboard Header -->
      <h1 class="text-3xl text-center sm:text-start font-bold mb-6">Admin Dashboard</h1>

      <!-- Tabs -->
      <div class="flex space-x-4 border-b mb-6 overflow-x-scroll">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="currentTab = tab.key"
          :class="[
            'px-4 py-2 font-medium border-b-2 transition',
            currentTab === tab.key
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-green-500'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="bg-white shadow rounded-lg p-0 sm:p-6">
        <component :is="currentTabComponent" @switch-tab="currentTab = $event" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import UsersTab from "@/components/admin/addUsers.vue"
import TicketsTab from "@/components/admin/manageTickets.vue"
import ReservationsTab from "@/components/admin/manageReservations.vue"
import StatisticsTab from "@/components/admin/displayStatistics.vue"
import MainTab from "@/components/admin/mainPanel.vue"
import DaysManagementTab from "@/components/admin/daysManagement.vue"
import EmailsLog from "@/components/admin/emailsLog.vue"
// Tabs definition
const tabs = [
  {key: "main", label: "Main", component: MainTab },
  { key: "users", label: "Users", component: UsersTab },
  {key: "tickets", label: "Tickets", component: TicketsTab },
  {key: "reservations", label: "Reservations", component: ReservationsTab },
  {key: "statistics", label: "Statistics", component: StatisticsTab },
  {key: "days", label: "Days Panel", component: DaysManagementTab },
  {key: "emails", label: "Email Logs", component: EmailsLog },

]

const currentTab = ref("main")

// Dynamically resolve component
const currentTabComponent = computed(() => {
  return tabs.find((t) => t.key === currentTab.value)?.component || UsersTab
})
</script>
