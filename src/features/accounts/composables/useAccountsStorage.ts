import type { Account, LabelItem } from '../account'
import { ACCOUNT_STORAGE_KEY, ACCOUNT_TYPE, isAccountType } from '../account'

type UnknownRecord = Record<string, unknown>

type AccountsStorage = {
  load: () => Account[]
  save: (accounts: Account[]) => void
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

function toLabelItem(value: unknown): LabelItem | null {
  if (!isRecord(value)) return null

  const text = value.text
  if (typeof text !== 'string') return null

  const trimmed = text.trim()
  if (trimmed.length === 0) return null

  return { text: trimmed }
}

function toAccount(value: unknown): Account | null {
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
    ? labels.map(toLabelItem).filter((item): item is LabelItem => item !== null)
    : []

  return {
    id,
    labels: safeLabels,
    type,
    login,
    password: type === ACCOUNT_TYPE.LOCAL && typeof password === 'string' ? password : null,
  }
}

function parseAccounts(raw: string): Account[] {
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed)) return []

  return parsed.map(toAccount).filter((item): item is Account => item !== null)
}

function getBrowserStorage(): Storage | null {
  if (typeof window === 'undefined') return null

  return window.localStorage
}

export function useAccountsStorage(): AccountsStorage {
  const storage = getBrowserStorage()

  const load = (): Account[] => {
    if (!storage) return []

    try {
      const raw = storage.getItem(ACCOUNT_STORAGE_KEY)
      if (!raw) return []

      return parseAccounts(raw)
    } catch (error) {
      console.warn('[accounts-storage] failed to load accounts from localStorage', error)
      return []
    }
  }

  const save = (accounts: Account[]): void => {
    if (!storage) return

    try {
      storage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts))
    } catch (error) {
      console.warn('[accounts-storage] failed to save accounts to localStorage', error)
    }
  }

  return {
    load,
    save,
  }
}
