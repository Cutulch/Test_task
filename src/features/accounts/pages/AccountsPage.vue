<script setup lang="ts">
import AccountsHeader from '../components/AccountsHeader.vue'
import AccountsHint from '../components/AccountsHint.vue'
import AccountsList from '../components/AccountsList.vue'
import { useAccountsForm } from '../composables/useAccountsForm'

const { drafts, errorsById, addAccount, removeAccount, updateDraft, validateAndPersist } = useAccountsForm()
</script>

<template>
  <main class="page">
    <AccountsHeader @add="addAccount" />
    <AccountsHint />

    <AccountsList
      :drafts="drafts"
      :errors-by-id="errorsById"
      @update-draft="updateDraft"
      @remove="removeAccount"
      @validate="validateAndPersist"
    />
  </main>
</template>

<style scoped>
.page {
  max-width: 1024px;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>
