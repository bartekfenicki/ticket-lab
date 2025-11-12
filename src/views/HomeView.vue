<template>
  <div class="mt-16 md:mt-32">
    <ParkMap/>
  </div>
 <div class="mt-16 mb-32">
    <BookingCalendar/>

  </div>
</template>
<script setup lang="ts">
import BookingCalendar from '@/components/home/bookingCalendar.vue';
import ParkMap from '@/components/home/parkMap.vue';
</script>
