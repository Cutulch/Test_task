export const ACCOUNT_TYPES = ['LDAP', 'LOCAL'] as const

export type AccountType = (typeof ACCOUNT_TYPES)[number]

export type LabelItem = {
  text: string
}

export type Account = {
  id: string
  labels: LabelItem[]
  type: AccountType
  login: string
  password: string | null
}

// Draft-форма для UI: метка хранится как строка до момента сохранения (потом парсится в массив объектов).
export type AccountDraft = {
  id: string
  labelInput: string
  type: AccountType | ''
  login: string
  password: string
}

export type AccountDraftErrors = Partial<
  Record<keyof Pick<AccountDraft, 'labelInput' | 'type' | 'login' | 'password'>, string>
>

export function isAccountType(value: unknown): value is AccountType {
  return value === 'LDAP' || value === 'LOCAL'
}

export function parseLabels(input: string): LabelItem[] {
  return input
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((text) => ({ text }))
}

export function validateAccountDraft(draft: AccountDraft): AccountDraftErrors {
  const errors: AccountDraftErrors = {}

  if (draft.labelInput.length > 50) {
    errors.labelInput = 'Максимум 50 символов'
  }

  if (!isAccountType(draft.type)) {
    errors.type = 'Выберите тип записи'
  }

  const loginTrimmed = draft.login.trim()
  if (loginTrimmed.length === 0) {
    errors.login = 'Обязательное поле'
  } else if (loginTrimmed.length > 100) {
    errors.login = 'Максимум 100 символов'
  }

  if (draft.password.length > 100) {
    errors.password = 'Максимум 100 символов'
  } else if (draft.type === 'LOCAL' && draft.password.trim().length === 0) {
    errors.password = 'Обязательное поле'
  }

  return errors
}

export function draftToAccount(draft: AccountDraft): Account | null {
  if (!isAccountType(draft.type)) return null

  return {
    id: draft.id,
    labels: parseLabels(draft.labelInput),
    type: draft.type,
    login: draft.login.trim(),
    password: draft.type === 'LOCAL' ? draft.password : null,
  }
}

export function accountToDraft(account: Account): AccountDraft {
  return {
    id: account.id,
    labelInput: account.labels.map((l) => l.text).join(';'),
    type: account.type,
    login: account.login,
    password: account.password ?? '',
  }
}

export function createEmptyAccountDraft(): AccountDraft {
  return {
    id: generateId(),
    labelInput: '',
    type: '',
    login: '',
    password: '',
  }
}

function generateId(): string {
  // randomUUID есть в современных браузерах. Фоллбек нужен для окружений без него.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
