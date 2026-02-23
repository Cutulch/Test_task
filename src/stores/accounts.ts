import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Account } from '../features/accounts/account'
import { useAccountsStorage } from '../features/accounts/composables/useAccountsStorage'

export const useAccountsStore = defineStore('accounts', () => {
  const storage = useAccountsStorage()
  const accounts = ref<Account[]>([])

  const load = () => {
    accounts.value = storage.load()
  }

  const upsert = (account: Account) => {
    const idx = accounts.value.findIndex((a) => a.id === account.id)
    if (idx === -1) {
      accounts.value.push(account)
      return
    }
    accounts.value[idx] = account
  }

  const remove = (id: string) => {
    accounts.value = accounts.value.filter((a) => a.id !== id)
  }

  load()

  watch(
    accounts,
    (next) => {
      storage.save(next)
    },
    { deep: true },
  )

  return {
    accounts,
    load,
    upsert,
    remove,
  }
})
