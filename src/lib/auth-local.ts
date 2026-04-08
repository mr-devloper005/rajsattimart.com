import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'

export type LocalAccount = { email: string; password: string }

export type LoginPrefs = {
  remember: boolean
  email?: string
  password?: string
}

export function loadLocalAccounts(): LocalAccount[] {
  return loadFromStorage<LocalAccount[]>(storageKeys.localAccounts, [])
}

function saveLocalAccounts(accounts: LocalAccount[]) {
  saveToStorage(storageKeys.localAccounts, accounts)
}

export function addLocalAccount(
  email: string,
  password: string
): { ok: true } | { ok: false; error: string } {
  const trimmed = email.trim()
  const normalized = trimmed.toLowerCase()
  if (!normalized || !password) {
    return { ok: false, error: 'Email and password are required.' }
  }
  const accounts = loadLocalAccounts()
  if (accounts.some((a) => a.email.toLowerCase() === normalized)) {
    return { ok: false, error: 'An account with this email already exists.' }
  }
  saveLocalAccounts([...accounts, { email: trimmed, password }])
  return { ok: true }
}

export function validateLocalLogin(
  email: string,
  password: string
): { ok: true } | { ok: false; error: string } {
  const trimmed = email.trim()
  if (!trimmed || !password) {
    return { ok: false, error: 'Email and password are required.' }
  }
  const accounts = loadLocalAccounts()
  if (accounts.length === 0) {
    return { ok: true }
  }
  const acc = accounts.find((a) => a.email.toLowerCase() === trimmed.toLowerCase())
  if (!acc) {
    return { ok: false, error: 'No account found for this email. Create one first.' }
  }
  if (acc.password !== password) {
    return { ok: false, error: 'Incorrect password.' }
  }
  return { ok: true }
}

export function loadLoginPrefs(): LoginPrefs {
  return loadFromStorage<LoginPrefs>(storageKeys.loginPrefs, { remember: false })
}

export function saveLoginPrefs(prefs: LoginPrefs) {
  if (!prefs.remember) {
    saveToStorage(storageKeys.loginPrefs, { remember: false })
    return
  }
  saveToStorage(storageKeys.loginPrefs, prefs)
}
