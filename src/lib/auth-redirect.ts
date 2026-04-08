/** Returns pathname if it is a safe same-origin relative redirect (open redirect guard). */
export function getSafeInternalPath(value: string | null | undefined): string | null {
  if (value == null || typeof value !== 'string') return null
  const t = value.trim()
  if (!t.startsWith('/') || t.startsWith('//')) return null
  return t
}
