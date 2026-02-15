export const ZL_VARIANTS = ['ז"ל', 'ז״ל', 'זל', 'ז ל'];

export function hasZL(name?: string) {
  if (!name) return false;
  const regex = /ז[\"״\u201C\u201D]?\s?ל/;
  return regex.test(name);
}

export function ensureZL(name?: string, fallback = ''): string {
  if (!name || name.trim() === '') return fallback;
  if (hasZL(name)) return name;
  return `${name} ז"ל`;
}

export function stripZL(name?: string): string {
  if (!name) return '';
  return name.replace(/\s*ז[\"״\u201C\u201D]?\s?ל\s*$/g, '').trim();
}
