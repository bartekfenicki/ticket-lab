<template>
  <div class="flex flex-col md:flex-row justify-around w-full">
    <div class="mx-auto w-full md:w-1/2">
      <CreateUser/>
    </div>
    <div class="mx-auto w-full mt-4 md:mt-0  md:w-1/2">
      <UsersList/>
    </div>
  </div>
</template>
<script setup lang="ts">
import CreateUser from '@/components/auth/createUser.vue';
import UsersList from '../auth/usersList.vue';
</script>
