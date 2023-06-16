<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

</script>

<template>
  <div>
    <h1>Hi {{ authUser?.username }}!</h1>
    <p>You're logged in !!</p>
  </div>
</template>
