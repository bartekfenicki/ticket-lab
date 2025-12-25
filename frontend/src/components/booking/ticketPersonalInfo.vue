<template>
  <div class="bg-white shadow-md rounded-xl p-6 mt-8">
    <h2 class="text-2xl font-semibold text-green-700 mb-4">🧾 Personal Information</h2>
    <p class="text-gray-600 mb-6">
      Please enter your contact details and the ticket holders’ names.
    </p>

    <div class="space-y-5">

      <!-- FIRST + LAST NAME -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- First Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>

          <input
            v-model="localForm.firstName"
            @input="validateField('firstName')"
            type="text"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            :class="errors.firstName ? 'border-red-500' : 'border-gray-300'"
          />

          <p v-if="errors.firstName" class="text-red-600 text-sm mt-1">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>

          <input
            v-model="localForm.lastName"
            @input="validateField('lastName')"
            type="text"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            :class="errors.lastName ? 'border-red-500' : 'border-gray-300'"
          />

          <p v-if="errors.lastName" class="text-red-600 text-sm mt-1">
            {{ errors.lastName }}
          </p>
        </div>
      </div>

      <!-- EMAIL + PHONE -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>

          <input
            v-model="localForm.email"
            @input="validateField('email')"
            type="email"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            :class="errors.email ? 'border-red-500' : 'border-gray-300'"
          />

          <p v-if="errors.email" class="text-red-600 text-sm mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>

          <input
            v-model="localForm.phone"
            @input="validateField('phone')"
            type="tel"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            :class="errors.phone ? 'border-red-500' : 'border-gray-300'"
          />

          <p v-if="errors.phone" class="text-red-600 text-sm mt-1">
            {{ errors.phone }}
          </p>
        </div>
      </div>

      <!-- ADDITIONAL NAMES -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Additional Names</label>

        <textarea
          v-model="localForm.names"
          @input="validateField('names')"
          placeholder="List full names for all ticket holders"
          rows="3"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          :class="errors.names ? 'border-red-500' : 'border-gray-300'"
        ></textarea>

        <p v-if="errors.names" class="text-red-600 text-sm mt-1">
          {{ errors.names }}
        </p>
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

const props = defineProps<{
  modelValue: PersonalInfo
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PersonalInfo): void
}>()

const sanitize = (value: string) => {
  return value.replace(/<[^>]*>?/gm, '')
}

const localForm = reactive({ ...props.modelValue })

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  names: ''
})

const validateField = (field: keyof PersonalInfo) => {
  const value = sanitize(localForm[field])

  localForm[field] = value

  switch (field) {
    case 'firstName':
    case 'lastName':
      errors[field] =
        !value ? 'Required' :
        value.length > 40 ? 'Too long (max 40 chars)' :
        !/^[A-Za-zÀ-ž\s'-]+$/.test(value) ? 'Invalid characters' :
        ''
      break

    case 'email':
      errors.email =
        !value ? 'Required' :
        value.length > 80 ? 'Too long (max 80 chars)' :
        !/^\S+@\S+\.\S+$/.test(value) ? 'Invalid email format' :
        ''
      break

    case 'phone':
      errors.phone =
        !value ? 'Required' :
        !/^[0-9+\-\s]{6,20}$/.test(value) ? 'Invalid phone number' :
        ''
      break

    case 'names':
      errors.names =
        value.length > 500 ? 'Too long (max 500 characters)' : ''
      break
  }
}

watch(
  localForm,
  () => emit('update:modelValue', { ...localForm }),
  { deep: true }
)
</script>

