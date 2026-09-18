'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2, Receipt } from 'lucide-react'
import { Expense, CATEGORIES, SOURCES, Source } from '@/types'
import { formatRupiah, formatDate } from '@/lib/utils'
import ReceiptModal from './ReceiptModal'

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
  showReceipt?: boolean
  emptyMessage?: string
}

export default function ExpenseList({
  expenses,
  onDelete,
  showReceipt = false,
  emptyMessage = 'Belum ada pengeluaran.',
}: ExpenseListProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16" style={{ color: 'rgba(196,167,231,0.3)' }}>
        <Receipt size={36} className="mb-3 opacity-30" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    )
  }

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete((prev) => (prev === id ? null : prev)), 3000)
    }
  }

  return (
    <>
      <div className="space-y-1">
        {expenses.map((expense, i) => (
          <div
            key={expense.id}
            className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors fade-in group"
            style={{
              animationDelay: `${i * 0.04}s`,
              animationFillMode: 'both',
              background: 'transparent',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,215,0,0.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Receipt thumbnail */}
            {showReceipt && (
              <button
                onClick={() => setSelectedExpense(expense)}
                className="flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center transition-all"
                style={{ background: 'rgba(45,74,140,0.3)', border: '1px solid rgba(255,215,0,0.08)' }}
              >
                {expense.receipt_url ? (
                  <Image
                    src={expense.receipt_url}
                    alt="Resi"
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Receipt size={18} style={{ color: 'rgba(196,167,231,0.3)' }} />
                )}
              </button>
            )}

            {/* Category indicator */}
            <div
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${CATEGORIES[expense.category]?.color ?? '#8b9dc3'}15` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CATEGORIES[expense.category]?.color ?? '#8b9dc3', boxShadow: `0 0 6px ${CATEGORIES[expense.category]?.color ?? '#8b9dc3'}` }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'rgba(245,240,224,0.9)' }}>
                {expense.description || CATEGORIES[expense.category]?.label}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs" style={{ color: 'rgba(196,167,231,0.4)' }}>
                  {formatDate(expense.created_at)} &middot; {CATEGORIES[expense.category]?.label}
                </p>
                {/* Source badge */}
                {expense.source && (
                  <span
                    className="star-badge"
                    style={{
                      color: SOURCES[expense.source as Source]?.color ?? '#c4a7e7',
                      background: SOURCES[expense.source as Source]?.bg ?? 'rgba(196,167,231,0.15)',
                      border: `1px solid ${SOURCES[expense.source as Source]?.color ?? '#c4a7e7'}30`,
                    }}
                  >
                    {SOURCES[expense.source as Source]?.label ?? expense.source}
                  </span>
                )}
              </div>
            </div>

            {/* Amount */}
            <p className="text-sm font-bold flex-shrink-0 tabular-nums" style={{ color: '#ffd700' }}>
              {formatRupiah(expense.amount)}
            </p>

            {/* Delete */}
            <button
              onClick={() => handleDelete(expense.id)}
              className="flex-shrink-0 p-2 rounded-lg transition-all"
              style={{
                color: confirmDelete === expense.id ? '#fff' : 'rgba(196,167,231,0.2)',
                background: confirmDelete === expense.id ? '#dc2626' : 'transparent',
              }}
              title={confirmDelete === expense.id ? 'Klik lagi untuk konfirmasi' : 'Hapus'}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {selectedExpense && (
        <ReceiptModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </>
  )
}
