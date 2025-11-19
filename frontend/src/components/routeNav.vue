<template>
  <nav class="bg-white shadow-md fixed top-0 left-0 w-full z-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <UserStatus/>
        <!-- Desktop Navigation -->
        <div class="hidden md:flex space-x-8 items-center">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
            active-class="text-indigo-600 font-semibold"
          >
            {{ link.name }}
          </RouterLink>

          <!-- Logo -->
        <div class="flex-shrink-0 flex items-center ms-4">
          <RouterLink to="/" class="text-2xl font-bold text-indigo-600">
            LOGO
          </RouterLink>
        </div>
        </div>

        <!-- Mobile Hamburger Button -->
        <div class="md:hidden">
          <button
            @click="toggleMenu"
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none transition-colors"
            aria-controls="mobile-menu"
            aria-expanded="isMenuOpen.toString()"
          >
            <svg
              v-if="!isMenuOpen"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-show="isMenuOpen"
      id="mobile-menu"
      class="md:hidden bg-white shadow-md border-t border-gray-100"
    >
      <div class="space-y-2 px-4 py-3">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="closeMenu"
          class="block text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
          active-class="text-indigo-600 font-semibold"
        >
          {{ link.name }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import UserStatus from './auth/userStatus.vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Pricing', to: '/pricing' },
  { name: 'Contact', to: '/contact' },
]
</script>

<style scoped>
/* Add smooth open/close animation for mobile menu */
#mobile-menu {
  transition: all 0.2s ease-in-out;
}
</style>
