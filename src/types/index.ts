export type Category = 'makanan' | 'transport' | 'belanja' | 'hiburan' | 'lain'
export type Source = 'bekal' | 'beasiswa' | 'lain'

export interface Expense {
  id: string
  user_id: string
  amount: number
  category: Category
  description: string
  receipt_url: string | null
  created_at: string
  source: Source
}

export interface CategoryInfo {
  label: string
  color: string
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  makanan: { label: 'Makanan', color: '#c9a96e' },
  transport: { label: 'Transport', color: '#9c8ec4' },
  belanja: { label: 'Belanja', color: '#d4a574' },
  hiburan: { label: 'Hiburan', color: '#b4a88c' },
  lain: { label: 'Lainnya', color: '#8d9eb8' },
}

export const SOURCES = {
  bekal: { label: 'Bekal', color: '#9c8ec4', bg: 'rgba(156,142,196,0.15)' },
  beasiswa: { label: 'Beasiswa', color: '#c9a96e', bg: 'rgba(201,169,110,0.15)' },
  lain: { label: 'Lain', color: '#8d6e63', bg: 'rgba(141,110,99,0.15)' },
} as const

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]
