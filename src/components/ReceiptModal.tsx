'use client'

import { X, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Expense } from '@/types'
import { formatRupiah, formatDate } from '@/lib/utils'
import { CATEGORIES } from '@/types'

interface ReceiptModalProps {
  expense: Expense
  onClose: () => void
}

export default function ReceiptModal({ expense, onClose }: ReceiptModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-gray-200">Detail Resi Belanja</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row overflow-auto max-h-[calc(90vh-64px)]">
          {/* Receipt Image */}
          <div className="md:w-1/2 bg-dark-700/50 flex items-center justify-center min-h-64 p-6">
            {expense.receipt_url ? (
              <div className="relative w-full h-72 md:h-96">
                <Image
                  src={expense.receipt_url}
                  alt="Resi belanja"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-600">
                <ImageIcon size={44} />
                <p className="text-sm">Tidak ada foto resi</p>
              </div>
            )}
          </div>

          {/* Expense Details */}
          <div className="md:w-1/2 p-6 space-y-6">
            <div>
              <p className="label">Jumlah</p>
              <p className="text-3xl font-bold gradient-text">
                {formatRupiah(expense.amount)}
              </p>
            </div>

            <div>
              <p className="label">Kategori</p>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: CATEGORIES[expense.category]?.color ?? '#6b7280' }}
              >
                {CATEGORIES[expense.category]?.label}
              </span>
            </div>

            <div>
              <p className="label">Deskripsi</p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {expense.description || 'Tidak ada deskripsi.'}
              </p>
            </div>

            <div>
              <p className="label">Tanggal</p>
              <p className="text-sm text-gray-300">
                {formatDate(expense.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
