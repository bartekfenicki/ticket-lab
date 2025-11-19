<template>
  <div
    class="relative mx-auto w-full md:w-3/5 h-[400px] bg-green-700 bg-gradient-to-b from-green-600 to-green-800 rounded-2xl shadow-lg"
  >
    <!-- Background grid / texture placeholder -->
    <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.15)_1px,_transparent_1px)] bg-[length:20px_20px]" />

    <!-- Interactive Elements -->
    <div
      v-for="area in areas"
      :key="area.name"
      class="absolute flex flex-col items-center group cursor-pointer transition-transform duration-300"
      :style="{ top: area.top, left: area.left }"
      @mouseenter="hoveredArea = area"
      @mouseleave="hoveredArea = null"
    >
      <!-- Placeholder circle for now -->
      <div
        class="w-16 h-16 rounded-full bg-emerald-400 border-4 border-emerald-700 shadow-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center font-bold text-emerald-900"
      >
        {{ area.icon }}
      </div>

      <!-- Label below each item -->
      <p class="mt-2 text-sm font-semibold text-white">{{ area.name }}</p>
    </div>

    <!-- Hover info panel (moved outside the clipping box) -->
    <teleport to="body">
      <transition name="fade">
        <div
          v-if="hoveredArea"
          class="fixed z-50 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl w-64 pointer-events-none"
          :style="panelPositionStyle"
        >
          <img
            :src="hoveredArea.image"
            alt="area"
            class="w-full h-32 object-cover rounded-md mb-2"
          />
          <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ hoveredArea.name }}</h3>
          <p class="text-sm text-gray-600">{{ hoveredArea.description }}</p>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Area {
  name: string
  icon: string
  image: string
  description: string
  top: string
  left: string
}

const hoveredArea = ref<Area | null>(null)
const mousePos = ref({ x: 0, y: 0 })

// Track cursor for hover panel positioning
const handleMouseMove = (e: MouseEvent) => {
  mousePos.value = { x: e.clientX, y: e.clientY }
}

onMounted(() => window.addEventListener('mousemove', handleMouseMove))
onUnmounted(() => window.removeEventListener('mousemove', handleMouseMove))

// Compute panel style based on cursor position
const panelPositionStyle = computed(() => ({
  top: `${mousePos.value.y + 20}px`,
  left: `${mousePos.value.x + 20}px`,
}))

const areas: Area[] = [
  { name: 'Maze', icon: '🌀', image: 'https://via.placeholder.com/300x200?text=Park+Maze', description: 'A fun hedge maze for visitors of all ages.', top: '10%', left: '55%' },
  { name: 'Bar', icon: '🍹', image: 'https://via.placeholder.com/300x200?text=Outdoor+Bar', description: 'Enjoy refreshing drinks under the open sky.', top: '15%', left: '25%' },
  { name: 'Tents Field', icon: '⛺', image: 'https://via.placeholder.com/300x200?text=Tents+Field', description: 'A peaceful area for camping and events.', top: '40%', left: '60%' },
  { name: 'Firecamp', icon: '🔥', image: 'https://via.placeholder.com/300x200?text=Firecamp', description: 'Gather around the campfire for stories and warmth.', top: '65%', left: '15%' },
  { name: 'Small Snake Maze', icon: '🐍', image: 'https://via.placeholder.com/300x200?text=Snake+Maze', description: 'A winding path for adventurous visitors.', top: '20%', left: '10%' },
  { name: 'Playground', icon: '🏖️', image: 'https://via.placeholder.com/300x200?text=Playground', description: 'A sandy playground for kids and families.', top: '45%', left: '20%' },
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
