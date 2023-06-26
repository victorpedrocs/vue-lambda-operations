<script setup lang="ts">

import { SignInFormType } from '@/helpers';
import { useAuthStore } from '@/stores';
import { ref } from 'vue';
import UserForm from '../components/UserForm.vue'

const authStore = useAuthStore();

const error = ref<string | undefined>(undefined)
const onSubmit = async (signupForm: SignInFormType) => {
  return authStore.signup(signupForm.username, signupForm.password).catch(err => error.value = err)
}
</script>
<template>
  <div>
    <el-card class="form-card" :body-style="{ padding: 20 }">
      <div>
        <h2>Sign up</h2>
      </div>
      <UserForm submit-label="Sign up" :error="error" @submit="onSubmit" />
    </el-card>
  </div>
</template>
<style>
.form-card {
  max-width: 480px;
}
</style>
