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
  makanan: { label: 'Makanan', color: '#f0c040' },
  transport: { label: 'Transport', color: '#00d4ff' },
  belanja: { label: 'Belanja', color: '#c4a7e7' },
  hiburan: { label: 'Hiburan', color: '#ff9ecd' },
  lain: { label: 'Lainnya', color: '#8b9dc3' },
}

export const SOURCES = {
  bekal: { label: 'Bekal', color: '#00d4ff', bg: 'rgba(0,212,255,0.15)' },
  beasiswa: { label: 'Beasiswa', color: '#ffd700', bg: 'rgba(255,215,0,0.15)' },
  lain: { label: 'Lain', color: '#c4a7e7', bg: 'rgba(196,167,231,0.15)' },
} as const

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]
