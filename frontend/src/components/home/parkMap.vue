<template>
  <h1 class="mb-2 mx-4 md:mx-auto w-full md:max-w-[820px] font-semibold text-xl">Hover to explore the park!</h1>
  <div
  class="relative mx-auto w-full md:max-w-[820px] h-[400px] rounded-2xl shadow-lg overflow-hidden grass-bg"
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
        class="group-hover:scale-110 transition-transform duration-300 flex items-center justify-center"
      >
         <img
            :src="area.icon"
            alt="area"
            class="w-full h-20 sm:h-32 object-cover rounded-md"
          />
      </div>


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
const isMobile = computed(() => window.innerWidth < 1024)

const panelPositionStyle = computed(() => {
  if (!hoveredArea.value) return {}

  const mouseX = mousePos.value.x
  const mouseY = mousePos.value.y

  // extract numeric percent from hoveredArea.left ("67%" → 67)
  const areaLeftPercent = Number(hoveredArea.value.left.replace('%', ''))
  const isRightSide = areaLeftPercent > 50 // simple logic: right half of map

  let offsetX = 20
  const offsetY = 20

  // MOBILE BEHAVIOR:
  // Always flip based on which side the icon is on
  if (isMobile.value) {
    offsetX = isRightSide ? -280 : 20 // panel width is ~256px → safe offset
  } else {
    // DESKTOP BEHAVIOR:
    // flip panel based on actual mouse position (near screen edges)
    if (mouseX + 300 > window.innerWidth) {
      offsetX = -280 // open LEFT if too close to right edge
    }
  }

  return {
    top: `${mouseY + offsetY}px`,
    left: `${mouseX + offsetX}px`,
  }
})

const areas: Area[] = [
  {
    name: 'Maze',
    icon: new URL('@/assets/icons/map/maze.png', import.meta.url).href,
    image: new URL('@/assets/images/lab.JPG', import.meta.url).href,
    description: 'A fun huge wooden maze for visitors of all ages.',
    top: '2%', left: '67%' },
  {
    name: 'Open Space for Activites',
    icon: new URL('@/assets/icons/map/sports.png', import.meta.url).href,
    image: new URL('@/assets/images/sports.jpg', import.meta.url).href,
    description: 'Our park contains loads of free green space to spend your time actively.',
    top: '33%', left: '75%' },

  {
    name: 'Tents Field',
    icon: new URL('@/assets/icons/map/tent.png', import.meta.url).href,
    image: new URL('@/assets/images/tents.jpg', import.meta.url).href,
    description: 'A peaceful area for camping, relaxing and events.',
    top: '33%', left: '52%' },
  {
    name: 'Parking',
    icon: new URL('@/assets/icons/map/parking.png', import.meta.url).href,
    image: new URL('@/assets/images/parking.jpg', import.meta.url).href,
    description: 'Our selected place for parking.',
    top: '63%', left: '67%' },
   {
    name: 'Balance Board and Games',
    icon: new URL('@/assets/icons/map/fungames.png', import.meta.url).href,
    image: new URL('@/assets/images/fungames.jpg', import.meta.url).href,
    description: 'Variety of different board games in unconvetional forms, crayons, paint and other fun stuff.',
    top: '2%', left: '40%' },
  {
    name: 'Bar',
    icon: new URL('@/assets/icons/map/bar2.png', import.meta.url).href,
    image: new URL('@/assets/images/bar.jpg', import.meta.url).href,
    description: 'Enjoy refreshing drinks and ice cream under the open sky.',
    top: '2%', left: '17%' },
  {
    name: 'Campfire',
    icon: new URL('@/assets/icons/map/fireplace.png', import.meta.url).href,
    image: new URL('@/assets/images/campfire.jpg', import.meta.url).href,
    description: 'Gather around the campfire for stories and warmth.',
    top: '65%', left: '17%' },
  {
    name: 'Playground',
    icon: new URL('@/assets/icons/map/playground.png', import.meta.url).href,
    image: new URL('@/assets/images/playground.jpg', import.meta.url).href,
    description: 'A sandy playground for kids and families with a beach relaxation spot and hammocks.',
    top: '33%', left: '28%' },
  {
    name: 'Rope Park',
    icon: new URL('@/assets/icons/map/rope.png', import.meta.url).href,
    image: new URL('@/assets/images/rope.jpg', import.meta.url).href,
    description: 'A fun area with a small maze and a balance rope.',
    top: '33%', left: '5%' },
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


.grass-bg {
  background:
    /* main gradient */
    linear-gradient(
      145deg,
      #0a4f1d 0%,
      #0f7a34 35%,
      #0b5c27 70%,
      #08501e 100%
    ),
    /* noise texture */
    url("data:image/svg+xml;utf8,\
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>\
      <filter id='n' x='0' y='0'>\
        <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/>\
      </filter>\
      <rect width='200' height='200' filter='url(%23n)' opacity='0.25'/>\
    </svg>");

  background-blend-mode: overlay;
  background-size: cover, 200px 200px;
}

</style>
