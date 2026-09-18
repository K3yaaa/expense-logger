'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2, Receipt } from 'lucide-react'
import { Expense, CATEGORIES } from '@/types'
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
      <div className="flex flex-col items-center justify-center py-16 text-gray-600">
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
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors group fade-in"
            style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'both' }}
          >
            {/* Receipt thumbnail */}
            {showReceipt && (
              <button
                onClick={() => setSelectedExpense(expense)}
                className="flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden bg-dark-600 flex items-center justify-center hover:ring-2 hover:ring-accent/50 transition-all"
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
                  <Receipt size={18} className="text-gray-600" />
                )}
              </button>
            )}

            {/* Category indicator */}
            <div
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${CATEGORIES[expense.category]?.color ?? '#6b7280'}18` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CATEGORIES[expense.category]?.color ?? '#6b7280' }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">
                {expense.description || CATEGORIES[expense.category]?.label}
              </p>
              <p className="text-xs text-gray-600">
                {formatDate(expense.created_at)} &middot; {CATEGORIES[expense.category]?.label}
              </p>
            </div>

            {/* Amount */}
            <p className="text-sm font-bold text-accent flex-shrink-0 tabular-nums">
              {formatRupiah(expense.amount)}
            </p>

            {/* Delete */}
            <button
              onClick={() => handleDelete(expense.id)}
              className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                confirmDelete === expense.id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-950/30'
              }`}
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
