<script setup lang="ts">

import { useAuthStore } from '@/stores';
import { ref } from 'vue';
import UserForm from '../components/UserForm.vue'
import { SignInFormType } from '@/helpers';

const authStore = useAuthStore();

const error = ref<string | undefined>(undefined)

const onSubmit = async (loginForm: SignInFormType) => {
  error.value = undefined
  await authStore.login(loginForm.username, loginForm.password).catch(err => error.value = err)
}

</script>


<template>
  <div>
    <el-card class="form-card" :body-style="{ padding: 20 }">
      <div>
        <h2>Log in</h2>
        <p>
          First time?
          <router-link to="/signup">Sign up</router-link>
        </p>
      </div>
      <UserForm submit-label="Login" :error="error" @submit="onSubmit" />
    </el-card>
  </div>
</template>
<style>
.form-card {
  max-width: 480px;
}
</style>
