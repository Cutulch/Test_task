<script setup lang="ts">
import type { AccountDraft, AccountDraftErrors } from '../account'
import AccountRow from './AccountRow.vue'

defineProps<{
  drafts: AccountDraft[]
  errorsById: Record<string, AccountDraftErrors>
}>()

const emit = defineEmits<{
  (e: 'update-draft', index: number, next: AccountDraft): void
  (e: 'remove', id: string): void
  (e: 'validate', draft: AccountDraft): void
}>()

const onUpdateDraft = (index: number, next: AccountDraft) => {
  emit('update-draft', index, next)
}

const onRemove = (id: string) => {
  emit('remove', id)
}

const onValidate = (draft: AccountDraft) => {
  emit('validate', draft)
}
</script>

<template>
  <section class="accounts-list">
    <el-empty
      v-if="drafts.length === 0"
      description="Нет учетных записей. Нажмите +, чтобы добавить."
    />

    <div v-else class="accounts-list__items">
      <AccountRow
        v-for="(draft, index) in drafts"
        :key="draft.id"
        :model-value="draft"
        :index="index"
        :errors="errorsById[draft.id]"
        @update:model-value="(next) => onUpdateDraft(index, next)"
        @remove="onRemove"
        @validate="onValidate"
      />
    </div>
  </section>
</template>

<style scoped>
.accounts-list__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
