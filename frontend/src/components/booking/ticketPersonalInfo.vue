<template>
  <div class="bg-white shadow-md rounded-xl p-6 mt-8">
    <h2 class="text-2xl font-semibold text-indigo-700 mb-4">🧾 Personal Information</h2>
    <p class="text-gray-600 mb-6">
      Please enter your contact details and the ticket holders’ names.
    </p>

    <div class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            v-model="localForm.firstName"
            type="text"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            v-model="localForm.lastName"
            type="text"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="localForm.email"
            type="email"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            v-model="localForm.phone"
            type="tel"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Additional Names</label>
        <textarea
          v-model="localForm.names"
          placeholder="List full names for all ticket holders"
          rows="3"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  names: string
}

// Correct v-model prop
const props = defineProps<{
  modelValue: PersonalInfo
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PersonalInfo): void
}>()

const localForm = reactive({ ...props.modelValue })

watch(
  localForm,
  (newVal) => {
    emit('update:modelValue', { ...newVal })
  },
  { deep: true }
)
</script>
