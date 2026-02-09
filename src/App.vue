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
        <el-card v-for="(draft, index) in drafts" :key="draft.id" class="accounts__item">
          <template #header>
            <div class="account__header">
              <div class="account__title">Учетная запись {{ index + 1 }}</div>
              <el-button type="danger" plain @click="onRemoveAccount(draft.id)">Удалить</el-button>
            </div>
          </template>

          <el-form label-position="top" :show-message="false">
            <el-row :gutter="12">
              <el-col :xs="24" :md="8">
                <el-form-item label="Метка" :error="errorsById[draft.id]?.labelInput">
                  <el-input
                    v-model="draft.labelInput"
                    maxlength="50"
                    placeholder="Например: dev;admin"
                    clearable
                    @blur="() => validateAndPersist(draft)"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :md="8">
                <el-form-item label="Тип записи" :error="errorsById[draft.id]?.type">
                  <el-select
                    v-model="draft.type"
                    placeholder="Выберите"
                    style="width: 100%"
                    @change="() => validateAndPersist(draft)"
                  >
                    <el-option label="LDAP" value="LDAP" />
                    <el-option label="Локальная" value="LOCAL" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :md="8">
                <el-form-item label="Логин" :error="errorsById[draft.id]?.login">
                  <el-input
                    v-model="draft.login"
                    maxlength="100"
                    clearable
                    @blur="() => validateAndPersist(draft)"
                  />
                </el-form-item>
              </el-col>

              <el-col v-if="draft.type === 'LOCAL'" :xs="24" :md="8">
                <el-form-item label="Пароль" :error="errorsById[draft.id]?.password">
                  <el-input
                    v-model="draft.password"
                    type="password"
                    show-password
                    maxlength="100"
                    clearable
                    @blur="() => validateAndPersist(draft)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
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

.accounts__item :deep(.el-card__header) {
  padding: 12px 16px;
}

.account__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.account__title {
  font-weight: 700;
  color: #111827;
}
</style>
