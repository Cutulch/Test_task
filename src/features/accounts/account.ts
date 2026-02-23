export const ACCOUNT_TYPE = {
  LDAP: 'LDAP',
  LOCAL: 'LOCAL',
} as const

export type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE]

export const ACCOUNT_TYPE_OPTIONS: ReadonlyArray<{ label: string; value: AccountType }> = [
  { label: 'LDAP', value: ACCOUNT_TYPE.LDAP },
  { label: 'Локальная', value: ACCOUNT_TYPE.LOCAL },
]

export const ACCOUNT_FIELD_LIMITS = {
  LABEL: 50,
  LOGIN: 100,
  PASSWORD: 100,
} as const

export const LABEL_SEPARATOR = ';'
export const ACCOUNT_STORAGE_KEY = 'test-task.accounts.v1'

const ACCOUNT_VALIDATION_MESSAGES = {
  REQUIRED: 'Обязательное поле',
  TYPE_REQUIRED: 'Выберите тип записи',
  LABEL_MAX: `Максимум ${ACCOUNT_FIELD_LIMITS.LABEL} символов`,
  LOGIN_MAX: `Максимум ${ACCOUNT_FIELD_LIMITS.LOGIN} символов`,
  PASSWORD_MAX: `Максимум ${ACCOUNT_FIELD_LIMITS.PASSWORD} символов`,
} as const

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
  return value === ACCOUNT_TYPE.LDAP || value === ACCOUNT_TYPE.LOCAL
}

export function parseLabels(input: string): LabelItem[] {
  return input
    .split(LABEL_SEPARATOR)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((text) => ({ text }))
}

export function validateAccountDraft(draft: AccountDraft): AccountDraftErrors {
  const errors: AccountDraftErrors = {}

  if (draft.labelInput.length > ACCOUNT_FIELD_LIMITS.LABEL) {
    errors.labelInput = ACCOUNT_VALIDATION_MESSAGES.LABEL_MAX
  }

  if (!isAccountType(draft.type)) {
    errors.type = ACCOUNT_VALIDATION_MESSAGES.TYPE_REQUIRED
  }

  const loginTrimmed = draft.login.trim()
  if (loginTrimmed.length === 0) {
    errors.login = ACCOUNT_VALIDATION_MESSAGES.REQUIRED
  } else if (loginTrimmed.length > ACCOUNT_FIELD_LIMITS.LOGIN) {
    errors.login = ACCOUNT_VALIDATION_MESSAGES.LOGIN_MAX
  }

  if (draft.type === ACCOUNT_TYPE.LOCAL) {
    if (draft.password.length > ACCOUNT_FIELD_LIMITS.PASSWORD) {
      errors.password = ACCOUNT_VALIDATION_MESSAGES.PASSWORD_MAX
    } else if (draft.password.trim().length === 0) {
      errors.password = ACCOUNT_VALIDATION_MESSAGES.REQUIRED
    }
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
    password: draft.type === ACCOUNT_TYPE.LOCAL ? draft.password : null,
  }
}

export function accountToDraft(account: Account): AccountDraft {
  return {
    id: account.id,
    labelInput: account.labels.map((l) => l.text).join(LABEL_SEPARATOR),
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
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
