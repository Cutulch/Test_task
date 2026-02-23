<script setup lang="ts">
const emit = defineEmits<{
  (e: 'add'): void
}>()

const onAdd = () => {
  emit('add')
}
</script>

<template>
  <header class="accounts-header">
    <h1 class="accounts-header__title">Учетные записи</h1>
    <el-button type="primary" circle aria-label="Добавить учетную запись" @click="onAdd"> + </el-button>
  </header>
</template>

<style scoped>
.accounts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.accounts-header__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}
</style>
