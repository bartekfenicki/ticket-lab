<template>
  <div class="">
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

<style scoped>
.pattern-square {
  --mx: 0;
  --my: 0;
  --a-x: calc(var(--mx) * 8px);
  --a-y: calc(var(--my) * 8px);
  --b-x: calc(var(--mx) * -6px);
  --b-y: calc(var(--my) * -6px);
  --c-x: calc(var(--mx) * 4px);
  --c-y: calc(var(--my) * 4px);

  background:
    repeating-linear-gradient(
        45deg,
        #0000 calc(-650% / 13) calc(50% / 13),
        #C19A6B 0 calc(100% / 13),
        #0000 0 calc(150% / 13),
        #C19A6B 0 calc(200% / 13),
        #0000 0 calc(250% / 13),
        #C19A6B 0 calc(300% / 13)
      )
      calc(0px + var(--c-x)) calc(0px + var(--c-y)),
    repeating-linear-gradient(
        45deg,
        #0000 calc(-650% / 13) calc(50% / 13),
        #C19A6B 0 calc(100% / 13),
        #0000 0 calc(150% / 13),
        #C19A6B 0 calc(200% / 13),
        #0000 0 calc(250% / 13),
        #C19A6B 0 calc(300% / 13)
      )
      calc(32px + var(--a-x)) calc(32px + var(--a-y)),
    repeating-linear-gradient(
        -45deg,
        #0000 calc(-650% / 13) calc(50% / 13),
        #C19A6B 0 calc(100% / 13),
        #0000 0 calc(150% / 13),
        #C19A6B 0 calc(200% / 13),
        #0000 0 calc(250% / 13),
        #C19A6B 0 calc(300% / 13)
      )
      calc(0px + var(--b-x)) calc(0px + var(--b-y)),
    repeating-linear-gradient(
        -45deg,
        #0000 calc(-650% / 13) calc(50% / 13),
        #C19A6B 0 calc(100% / 13),
        #0000 0 calc(150% / 13),
        #C19A6B 0 calc(200% / 13),
        #0000 0 calc(250% / 13),
        #C19A6B 0 calc(300% / 13)
      )
      calc(32px + var(--a-x)) calc(32px + var(--a-y)) #eeca9e;

  background-size: 64px 64px;
  width: 100%;
  height: 100%;
}
</style>

