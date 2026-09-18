export type Category = 'makanan' | 'transport' | 'belanja' | 'hiburan' | 'lain'

export interface Expense {
  id: string
  user_id: string
  amount: number
  category: Category
  description: string
  receipt_url: string | null
  created_at: string
}

export interface CategoryInfo {
  label: string
  color: string
  icon: string
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  makanan: { label: 'Makanan', color: '#f59e0b', icon: '🍔' },
  transport: { label: 'Transport', color: '#3b82f6', icon: '🚗' },
  belanja: { label: 'Belanja', color: '#8b5cf6', icon: '🛒' },
  hiburan: { label: 'Hiburan', color: '#ec4899', icon: '🎬' },
  lain: { label: 'Lainnya', color: '#6b7280', icon: '📦' },
}

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]
