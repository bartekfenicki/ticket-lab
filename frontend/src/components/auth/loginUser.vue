<template>
  <div class="max-w-sm mx-auto bg-white p-6 rounded-xl shadow-md">
    <h2 class="text-xl font-semibold text-indigo-700 mb-4">Staff Login</h2>
    <form @submit.prevent="loginUser" class="space-y-4">
      <input v-model="email" type="email" placeholder="Email" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500" />
      <input v-model="password" type="password" placeholder="Password" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500" />
      <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/staffUserStore";
import router from "@/router";
const store = useUserStore();

const email = ref("");
const password = ref("");

const loginUser = async () => {
  await store.login(email.value, password.value);
  router.push("/");
};
</script>
