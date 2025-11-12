<script setup lang="ts">
import { RouterView } from 'vue-router';
import RouteNav from './components/routeNav.vue';


</script>

<template>
  <RouteNav/>

<div class="mt-16">
  <RouterView/>
</div>

</template>

<style scoped></style>
