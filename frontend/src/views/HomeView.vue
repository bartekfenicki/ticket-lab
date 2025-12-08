<template>
  <div class="w-full">
    <div class="pt-16 w-full">
        <ParkMap/>
      </div>
    <div class="mt-16 pb-32">
        <BookingCalendar/>
      </div>

  </div>


</template>
<script setup lang="ts">
import BookingCalendar from '@/components/home/bookingCalendar.vue';
import ParkMap from '@/components/home/parkMap.vue';
</script>


