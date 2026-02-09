import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Account, LabelItem } from '../features/accounts/account'
import { isAccountType } from '../features/accounts/account'

const STORAGE_KEY = 'test-task.accounts.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function coerceLabelItem(value: unknown): LabelItem | null {
  if (!isRecord(value)) return null
  const text = value.text
  if (typeof text !== 'string') return null

  const trimmed = text.trim()
  if (trimmed.length === 0) return null

  return { text: trimmed }
}

function coerceAccount(value: unknown): Account | null {
  if (!isRecord(value)) return null

  const id = value.id
  const type = value.type
  const login = value.login
  const password = value.password
  const labels = value.labels

  if (typeof id !== 'string' || id.trim().length === 0) return null
  if (!isAccountType(type)) return null
  if (typeof login !== 'string') return null

  const safeLabels: LabelItem[] = Array.isArray(labels)
    ? labels.map(coerceLabelItem).filter((x): x is LabelItem => x !== null)
    : []

  let safePassword: string | null = null
  if (type === 'LOCAL') {
    safePassword = typeof password === 'string' ? password : ''
  } else {
    safePassword = null
  }

  return {
    id,
    labels: safeLabels,
    type,
    login,
    password: safePassword,
  }
}

function loadAccountsFromStorage(): Account[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.map(coerceAccount).filter((x): x is Account => x !== null)
  } catch (err) {
    console.warn('[accounts] failed to load from storage', err)
    return []
  }
}

function persistAccountsToStorage(accounts: Account[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
  } catch (err) {
    console.warn('[accounts] failed to persist to storage', err)
  }
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  const load = () => {
    accounts.value = loadAccountsFromStorage()
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

  // Инициализация хранилища при первом использовании стора.
  load()

  watch(
    accounts,
    (next) => {
      persistAccountsToStorage(next)
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
