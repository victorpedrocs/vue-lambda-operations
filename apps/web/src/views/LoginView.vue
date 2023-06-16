<script setup lang="ts">

import { useAuthStore } from '@/stores';
import { reactive, ref } from 'vue';
import { FormInstance } from 'element-plus';

const authStore = useAuthStore();

type SignInFormType = {
  username: string
  password: string
}
const formRef = ref<FormInstance>()
const loginForm = reactive<SignInFormType>({
  username: '',
  password: ''
})
const errors = reactive({ error: undefined })

const onSubmit = async () => {
  if (!formRef.value) return

  await authStore.login(loginForm.username, loginForm.password).catch(error => errors.error = error)
}

const rules = [{ required: true, trigger: 'blur', message: 'Is required' }]
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
      <el-form @submit.prevent="onSubmit" ref="formRef" :model="loginForm" label-position="top" status-icon>
        <el-form-item label="Username" :rules="rules" prop="username">
          <el-input v-model="loginForm.username" size="large" />
        </el-form-item>
        <el-form-item label="Password" :rules="rules" prop="password">
          <el-input v-model="loginForm.password" size="large" />
        </el-form-item>
        <el-button @click="onSubmit" type="primary" size="large" class="w-full">Sign in</el-button>
      </el-form>
      <el-alert v-if="errors.error" type="error" :title="errors.error" style="margin-top: 10px;" />
    </el-card>
  </div>
</template>
<style>
.form-card {
  max-width: 480px;
}
</style>
