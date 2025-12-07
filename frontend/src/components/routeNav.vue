<template>
  <nav class="bg-white shadow-md fixed top-0 left-0 w-full z-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center">

          <div class="flex-shrink-0 md:hidden flex items-center ms-4">
          <RouterLink to="/" class="flex items-center">
            <img
              :src="logo"
              alt="Logo"
              class="h-16 w-auto object-contain"
            />
          </RouterLink>
          </div>
          <div class="hidden md:block">
            <UserStatus />
          </div>
          <OpeningHoursToday/>
        </div>


        <!-- Desktop Navigation -->
        <div class="hidden md:flex space-x-8 items-center">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
            active-class="text-green-600 font-semibold"
          >
            {{ link.name }}
          </RouterLink>

          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center ms-4">
          <RouterLink to="/" class="flex items-center">
            <img
              :src="logo"
              alt="Logo"
              class="h-16 w-auto object-contain"
            />
          </RouterLink>
          </div>
        </div>

        <!-- Mobile Hamburger -->
        <div class="md:hidden">
          <button
            @click="toggleMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors"
          >
            <svg
              v-if="!isMenuOpen"
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
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
      class="md:hidden bg-white shadow-md border-t border-gray-100"
    >
      <div class="space-y-2 px-4 py-3">
         <div class="flex w-full justify-end">
            <UserStatus />
          </div>
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="closeMenu"
          class="block text-gray-700 hover:text-green-600 font-medium transition-colors"
          active-class="text-indigo-600 font-semibold"
        >
          {{ link.name }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import UserStatus from "./auth/userStatus.vue";
import { useUserStore } from "@/stores/staffUserStore";
import logo from "@/assets/icons/logo/lab-logo.jpeg"
import OpeningHoursToday from "./UI/openingHoursToday.vue";

const isMenuOpen = ref(false);
const userStore = useUserStore();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// Base links always visible
const baseLinks = [
  { name: "Home", to: "/" },
  { name: "Pricing", to: "/pricing" },
  { name: "Contact", to: "/contact" },
];

// Admin link should appear ONLY if logged in
const navLinks = computed(() => {
  if (userStore.user) {
    return [...baseLinks, { name: "Admin", to: "/admin" }];
  }
  return baseLinks;
});
</script>

<style scoped>
/* Add smooth open/close animation for mobile menu */
#mobile-menu {
  transition: all 0.2s ease-in-out;
}
</style>
