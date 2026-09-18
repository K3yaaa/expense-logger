'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2, ImageIcon, Receipt } from 'lucide-react'
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
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Receipt size={40} className="mb-3 opacity-40" />
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
      // Auto-cancel after 3 seconds
      setTimeout(() => setConfirmDelete((prev) => (prev === id ? null : prev)), 3000)
    }
  }

  return (
    <>
      <div className="space-y-2">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group"
          >
            {/* Receipt thumbnail */}
            {showReceipt && (
              <button
                onClick={() => setSelectedExpense(expense)}
                className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-dark-500 flex items-center justify-center hover:ring-2 hover:ring-accent transition-all"
              >
                {expense.receipt_url ? (
                  <Image
                    src={expense.receipt_url}
                    alt="Struk"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <ImageIcon size={20} className="text-gray-600" />
                )}
              </button>
            )}

            {/* Category badge */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: `${CATEGORIES[expense.category]?.color}20` }}
              title={CATEGORIES[expense.category]?.label}
            >
              {CATEGORIES[expense.category]?.icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {expense.description || CATEGORIES[expense.category]?.label}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(expense.created_at)} · {CATEGORIES[expense.category]?.label}
              </p>
            </div>

            {/* Amount */}
            <p className="text-sm font-bold text-accent flex-shrink-0">
              {formatRupiah(expense.amount)}
            </p>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(expense.id)}
              className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                confirmDelete === expense.id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-red-400 hover:bg-dark-500'
              }`}
              title={confirmDelete === expense.id ? 'Klik lagi untuk konfirmasi' : 'Hapus'}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Receipt Modal */}
      {selectedExpense && (
        <ReceiptModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </>
  )
}
