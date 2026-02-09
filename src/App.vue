<script setup lang="ts">
const onAddAccount = () => {
  // TODO: добавление строки учетной записи (реализуем на следующих шагах)
}
</script>

<template>
  <main class="page">
    <header class="page__header">
      <h1 class="page__title">Учетные записи</h1>
      <el-button type="primary" circle aria-label="Добавить учетную запись" @click="onAddAccount">
        +
      </el-button>
    </header>

    <el-card>
      <p class="page__placeholder">Здесь будет форма управления учетными записями.</p>
    </el-card>
  </main>
</template>

<style scoped>
.page {
  max-width: 1024px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.page__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}

.page__placeholder {
  margin: 0;
  color: #6b7280;
}
</style>
