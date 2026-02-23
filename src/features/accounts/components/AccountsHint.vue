<template>
  <el-alert class="accounts-hint" type="info" show-icon :closable="false">
    <template #title>Подсказка для поля «Метка»</template>
    <template #default>
      Введите метки через символ <code>;</code> (например: <code>dev;admin</code>).
    </template>
  </el-alert>
</template>

<style scoped>
.accounts-hint {
  margin-bottom: 16px;
}
</style>
