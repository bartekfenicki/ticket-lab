<template>
  <div class="min-h-screen bg-gray-50 py-12 px-6">
    <div class="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
      <h1 class="text-3xl font-bold text-indigo-700 mb-6">
        👑 Admin Panel
      </h1>

      <p class="text-gray-700 mb-4">
        Welcome back, <strong>{{ userStore.user?.name }}</strong>!
      </p>
      <p class="text-sm text-gray-500 mb-8">
        Role: <strong>{{ userStore.user?.role }}</strong>
      </p>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Example admin sections -->
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow transition">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">👥 Manage Staff Users</h2>
          <p class="text-gray-600 mb-3">View, add, or remove staff members.</p>
          <router-link
            to="/admin/users"
            class="text-indigo-600 hover:underline text-sm font-medium"
          >
            Go to Staff Management →
          </router-link>
        </div>

        <div class="border border-gray-200 rounded-lg p-4 hover:shadow transition">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">🎟 Manage Bookings</h2>
          <p class="text-gray-600 mb-3">View and oversee ticket and reservation activity.</p>
          <router-link
            to="/admin/bookings"
            class="text-indigo-600 hover:underline text-sm font-medium"
          >
            Go to Booking Management →
          </router-link>
        </div>

        <div class="border border-gray-200 rounded-lg p-4 hover:shadow transition">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">⚙️ Settings</h2>
          <p class="text-gray-600 mb-3">Configure park information, opening hours, and more.</p>
          <router-link
            to="/admin/settings"
            class="text-indigo-600 hover:underline text-sm font-medium"
          >
            Go to Settings →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/staffUserStore";
const userStore = useUserStore();
</script>
