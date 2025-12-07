<template>
  <div class="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6 border border-gray-100">
    <h2 class="text-2xl font-semibold text-green-700"> Create New Staff User</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input v-model="form.name" type="text" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500" required />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="form.email" type="email" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500" required />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input v-model="form.password" type="password" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500" required />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Role</label>
        <select v-model="form.role" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500">
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
        Create User
      </button>
    </form>

    <p v-if="userStore.error" class="text-red-600">{{ userStore.error }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useUserStore } from "@/stores/staffUserStore";

const userStore = useUserStore();

const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "staff",
});

const handleSubmit = async () => {
  await userStore.createUser(form);
  if (!userStore.error) {
    alert("User created successfully!");
    Object.assign(form, { name: "", email: "", password: "", role: "staff" });
  }
};
</script>
