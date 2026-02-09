<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAccountsStore } from './stores/accounts'
import type { AccountDraft, AccountDraftErrors } from './features/accounts/account'
import {
  accountToDraft,
  createEmptyAccountDraft,
  draftToAccount,
  validateAccountDraft,
} from './features/accounts/account'
import AccountRow from './features/accounts/components/AccountRow.vue'

const store = useAccountsStore()

const drafts = ref<AccountDraft[]>(store.accounts.map(accountToDraft))
const errorsById = reactive<Record<string, AccountDraftErrors>>({})

const onAddAccount = () => {
  const draft = createEmptyAccountDraft()
  drafts.value.push(draft)
  errorsById[draft.id] = {}
}

const onRemoveAccount = (id: string) => {
  drafts.value = drafts.value.filter((d) => d.id !== id)
  delete errorsById[id]
  store.remove(id)
}

const onUpdateDraft = (index: number, next: AccountDraft) => {
  // Индекс приходит из v-for, но guard нужен для типобезопасности.
  if (!drafts.value[index]) return
  drafts.value[index] = next
}

const validateAndPersist = (draft: AccountDraft) => {
  const errors = validateAccountDraft(draft)
  errorsById[draft.id] = errors

  if (Object.keys(errors).length > 0) return

  const account = draftToAccount(draft)
  if (!account) return

  store.upsert(account)
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

    <el-alert class="page__hint" type="info" show-icon :closable="false">
      <template #title>Подсказка для поля «Метка»</template>
      <template #default>
        Введите метки через символ <code>;</code> (например: <code>dev;admin</code>).
      </template>
    </el-alert>

    <section class="accounts">
      <el-empty
        v-if="drafts.length === 0"
        description="Нет учетных записей. Нажмите +, чтобы добавить."
      />

      <div v-else class="accounts__list">
        <AccountRow
          v-for="(draft, index) in drafts"
          :key="draft.id"
          :model-value="draft"
          :index="index"
          :errors="errorsById[draft.id]"
          @update:model-value="(next) => onUpdateDraft(index, next)"
          @remove="onRemoveAccount"
          @validate="validateAndPersist"
        />
      </div>
    </section>
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

.page__hint {
  margin-bottom: 16px;
}

.accounts__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
