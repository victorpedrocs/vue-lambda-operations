<script setup lang="ts">
import { SignInFormType } from '@/helpers';
import { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

const formRef = ref<FormInstance>()
const loginForm = reactive<SignInFormType>({
  username: '',
  password: ''
})

defineProps({
  submitLabel: {
    type: String,
    defualt: 'Login',
  },
  error: {
    type: String,
    default: undefined,
  }
})

const emit = defineEmits<{
  submit: [loginForm: SignInFormType]
}>()

const handleSubmit = (formElement: FormInstance | undefined) => {
  if (!formElement) {
    return
  }
  formElement.validate((valid) => {
    if (valid) {
      emit('submit', loginForm)
    } else {
      return false
    }
  })
}

const rules = [{ required: true, trigger: 'blur', message: 'Is required' }]
</script>
<template>
  <div>
    <el-form ref="formRef" :model="loginForm" label-position="top" @keydown.enter="handleSubmit(formRef)" status-icon>
      <el-form-item label="Username" :rules="rules" prop="username">
        <el-input v-model="loginForm.username" size="large" />
      </el-form-item>
      <el-form-item label="Password" :rules="rules" prop="password">
        <el-input v-model="loginForm.password" type="password" size="large" />
      </el-form-item>
      <el-button @click="handleSubmit(formRef)" type="primary" size="large" class="w-full">{{ submitLabel }}</el-button>
    </el-form>
    <el-alert v-if="error" type="error" :title="error" style="margin-top: 10px;" :closable="false" />
  </div>
</template>

