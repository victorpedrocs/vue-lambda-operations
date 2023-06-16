<script setup lang="ts">

import { useAuthStore } from '@/stores';
import { reactive, ref } from 'vue';
import { FormInstance } from 'element-plus';

const authStore = useAuthStore();

type SignupFormType = {
  username: string
  password: string
}
const formRef = ref<FormInstance>()
const signupForm = reactive<SignupFormType>({
  username: '',
  password: ''
})

const errors = reactive({ error: undefined })

const onSubmit = async () => {
  if (!formRef.value) return

  return authStore.signup(signupForm.username, signupForm.password).catch(error => errors.error = error)
}

const rules = [{ required: true, trigger: 'blur', message: 'Is required' }]
</script>


<template>
  <div>
    <el-card class="form-card" :body-style="{ padding: 20 }">
      <div>
        <h2>Sign up</h2>
      </div>
      <el-form ref="formRef" :model="signupForm" label-position="top" status-icon>
        <el-form-item label="Username" :rules="rules" prop="username">
          <el-input v-model="signupForm.username" size="large" />
        </el-form-item>
        <el-form-item label="Password" :rules="rules" prop="password">
          <el-input v-model="signupForm.password" size="large" />
        </el-form-item>
        <el-button @click="onSubmit" type="primary" size="large" class="w-full">Sign up</el-button>
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
