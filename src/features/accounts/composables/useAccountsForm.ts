import { reactive, ref } from 'vue'
import type { AccountDraft, AccountDraftErrors } from '../account'
import {
  accountToDraft,
  createEmptyAccountDraft,
  draftToAccount,
  validateAccountDraft,
} from '../account'
import { useAccountsStore } from '../../../stores/accounts'

type DraftErrorsMap = Record<string, AccountDraftErrors>

export function useAccountsForm() {
  const store = useAccountsStore()

  const drafts = ref<AccountDraft[]>(store.accounts.map(accountToDraft))
  const errorsById = reactive<DraftErrorsMap>({})

  const addAccount = () => {
    const draft = createEmptyAccountDraft()
    drafts.value.push(draft)
    errorsById[draft.id] = {}
  }

  const removeAccount = (id: string) => {
    drafts.value = drafts.value.filter((draft) => draft.id !== id)
    delete errorsById[id]
    store.remove(id)
  }

  const updateDraft = (index: number, next: AccountDraft) => {
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

  return {
    drafts,
    errorsById,
    addAccount,
    removeAccount,
    updateDraft,
    validateAndPersist,
  }
}
