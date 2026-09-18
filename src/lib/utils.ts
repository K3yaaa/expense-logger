export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatMonth(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function parseRupiahInput(value: string): number {
  const cleaned = value.replace(/[^\d]/g, '')
  return parseInt(cleaned, 10) || 0
}

export function formatRupiahInput(value: number): string {
  if (value === 0) return ''
  return new Intl.NumberFormat('id-ID').format(value)
}

export function getMonthKey(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function getCurrentMonthKey(): string {
  return getMonthKey(new Date().toISOString())
}
