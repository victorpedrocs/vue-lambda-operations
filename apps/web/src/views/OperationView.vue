<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ValueOf } from '@/helpers';
import { FormInstance, FormItemRule } from 'element-plus';
import { useRecordsStore } from '@/stores'
import { storeToRefs } from 'pinia';

const opStore = useRecordsStore()
const { operation } = storeToRefs(opStore)

const operations = {
  Addition: 'add',
  Subtraction: 'sub',
  Multiplication: 'multi',
  Division: 'div',
  ['Square Root']: 'sqrt',
  ['Random String']: 'str',
} as const

type RandomStringParams = {
  length: number
}
type ArithmeticParams = {
  a: number
  b: number
}
export type OperationPayload = {
  type: ValueOf<typeof operations>
  params: RandomStringParams | ArithmeticParams
}

const formRef = ref<FormInstance>()
const opForm = reactive<OperationPayload>({
  type: 'add',
  params: { a: 0, b: 0 }
})

const requiredRule: FormItemRule = {
  required: true,
  message: 'Is required',
  trigger: 'blur'
}
const numberTypeRule: FormItemRule = {
  type: 'integer',
  message: 'Must be a number',
  trigger: 'blur',
}
const formRules = [requiredRule, numberTypeRule]

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    formRef.value?.validate
    if (valid) {
      await opStore.postOperation(opForm)
    }
  })
}

</script>

<template>
  <el-row>
    <el-col :span="12">
      <el-alert v-if="operation?.error" type="error" title="Request failed" :description="operation?.error"
        style="margin-bottom: 10px;" />
      <el-card class="box-card">
        <template #header>
          <h2>Operation</h2>
        </template>
        <el-form ref="formRef" :model="opForm" status-icon style="max-width: 460px" label-width="70px"
          label-position="left">
          <el-form-item label="Type" prop="type" :rules="requiredRule">
            <el-select v-model="opForm.type">
              <el-option v-for="(value, key) in operations" :label="key" :value="value" />
            </el-select>
          </el-form-item>
          <el-form-item label="A" v-if="opForm.type !== 'str'" prop="params.a" :rules="formRules">
            <el-input v-model.number="(opForm.params as ArithmeticParams).a" />
          </el-form-item>
          <el-form-item label="B" v-if="!['str', 'sqrt'].includes(opForm.type)" prop="params.b" :rules="formRules">
            <el-input v-model.number="(opForm.params as ArithmeticParams).b" />
          </el-form-item>
          <el-form-item label="Length" v-if="opForm.type === 'str'" prop="params.length" :rules="[
            ...formRules,
            {
              type: 'number',
              min: 1,
              max: 32,
              trigger: 'blur',
              message: 'Length should be 1 to 32'
            }
          ]">
            <el-input v-model.number="(opForm.params as RandomStringParams).length" />
          </el-form-item>
          <el-form-item>
            <el-button :disabled="operation?.loading" @click="onSubmit" type="primary">Send!</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="8" class="result">
      <el-result v-if="!!operation?.store" icon="success" :title="operation?.store?.operationResponse">
        <template>
          {{ JSON.stringify(operation?.store) }}
        </template>
      </el-result>
    </el-col>
  </el-row>
  <div></div>
</template>
<style>
.result {
  display: flex;
  align-items: center;
}

.box-card {
  max-width: fit-content;
}
</style>
