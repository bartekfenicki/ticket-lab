<template>
  <div class="flex items-center space-x-4">
    <!-- When user is logged in -->
    <div v-if="userStore.user" class="flex items-center gap-3">
      <div class="text-right">
        <p class="text-sm font-medium text-gray-800">
          {{ userStore.user.name }}
        </p>
        <p class="text-xs text-gray-500 capitalize">
          {{ userStore.user.role }}
        </p>
      </div>

      <button
        @click="logout"
        class="px-3 py-1 text-sm font-medium bg-gray-200 hover:bg-gray-300 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/staffUserStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  userStore.logout();
  router.push("/");
};

</script>
