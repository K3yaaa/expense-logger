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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-dark-800 border border-dark-600 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-600">
          <h2 className="text-lg font-semibold text-white">Detail Struk</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row overflow-auto max-h-[calc(90vh-64px)]">
          {/* Receipt Image */}
          <div className="md:w-1/2 bg-dark-700 flex items-center justify-center min-h-64 p-4">
            {expense.receipt_url ? (
              <div className="relative w-full h-64 md:h-full min-h-64">
                <Image
                  src={expense.receipt_url}
                  alt="Struk"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <ImageIcon size={48} />
                <p className="text-sm">Tidak ada struk</p>
              </div>
            )}
          </div>

          {/* Expense Details */}
          <div className="md:w-1/2 p-6 space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Jumlah
              </p>
              <p className="text-2xl font-bold text-accent">
                {formatRupiah(expense.amount)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Kategori
              </p>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: CATEGORIES[expense.category]?.color ?? '#6b7280' }}
              >
                {CATEGORIES[expense.category]?.icon}{' '}
                {CATEGORIES[expense.category]?.label}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Deskripsi
              </p>
              <p className="text-sm text-gray-300">
                {expense.description || 'Tidak ada deskripsi.'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Tanggal
              </p>
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
