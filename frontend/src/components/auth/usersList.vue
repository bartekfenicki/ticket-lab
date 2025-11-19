<template>
  <div class="flex justify-center">
    <div v-if="userStore" class="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">User List</h2>

      <div v-for="user in userStore.users_list"
           :key="user.id"
           class="flex justify-between items-center p-3 border-b last:border-b-0 hover:bg-gray-50 rounded-lg transition">

        <div>
          <p class="text-lg font-medium text-gray-900">{{ user.name }}</p>
          <p class="text-sm text-gray-500">{{ user.role }}</p>
        </div>

      </div>
    </div>

    <div v-else class="flex justify-center">
      <p class="text-red-600 font-semibold">Something went wrong</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/staffUserStore';
import { onMounted } from 'vue';

const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchUsers();
});
</script>
