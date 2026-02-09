<script setup lang="ts">
import { computed } from 'vue'
import type { AccountDraft, AccountDraftErrors } from '../account'

const props = defineProps<{
  modelValue: AccountDraft
  index: number
  errors?: AccountDraftErrors
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: AccountDraft): void
  (e: 'remove', id: string): void
  (e: 'validate', draft: AccountDraft): void
}>()

const fieldErrors = computed(() => props.errors ?? {})

const labelInput = computed({
  get: () => props.modelValue.labelInput,
  set: (value: string) => {
    emit('update:modelValue', { ...props.modelValue, labelInput: value })
  },
})

const type = computed({
  get: () => props.modelValue.type,
  set: (value: AccountDraft['type']) => {
    emit('update:modelValue', { ...props.modelValue, type: value })
  },
})

const login = computed({
  get: () => props.modelValue.login,
  set: (value: string) => {
    emit('update:modelValue', { ...props.modelValue, login: value })
  },
})

const password = computed({
  get: () => props.modelValue.password,
  set: (value: string) => {
    emit('update:modelValue', { ...props.modelValue, password: value })
  },
})

const onValidate = () => {
  emit('validate', props.modelValue)
}

const onRemove = () => {
  emit('remove', props.modelValue.id)
}
</script>

<template>
  <el-card class="account-row">
    <template #header>
      <div class="account-row__header">
        <div class="account-row__title">Учетная запись {{ index + 1 }}</div>
        <el-button type="danger" plain @click="onRemove">Удалить</el-button>
      </div>
    </template>

    <el-form label-position="top" :show-message="false">
      <el-row :gutter="12">
        <el-col :xs="24" :md="8">
          <el-form-item label="Метка" :error="fieldErrors.labelInput">
            <el-input
              v-model="labelInput"
              maxlength="50"
              placeholder="Например: dev;admin"
              clearable
              @blur="onValidate"
            />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :md="8">
          <el-form-item label="Тип записи" :error="fieldErrors.type">
            <el-select
              v-model="type"
              placeholder="Выберите"
              style="width: 100%"
              @change="onValidate"
            >
              <el-option label="LDAP" value="LDAP" />
              <el-option label="Локальная" value="LOCAL" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :md="8">
          <el-form-item label="Логин" :error="fieldErrors.login">
            <el-input v-model="login" maxlength="100" clearable @blur="onValidate" />
          </el-form-item>
        </el-col>

        <el-col v-if="type === 'LOCAL'" :xs="24" :md="8">
          <el-form-item label="Пароль" :error="fieldErrors.password">
            <el-input
              v-model="password"
              type="password"
              show-password
              maxlength="100"
              clearable
              @blur="onValidate"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<style scoped>
.account-row :deep(.el-card__header) {
  padding: 12px 16px;
}

.account-row__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.account-row__title {
  font-weight: 700;
  color: #111827;
}
</style>

