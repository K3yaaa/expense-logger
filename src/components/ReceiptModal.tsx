'use client'

import { X, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Expense, CATEGORIES, SOURCES, Source } from '@/types'
import { formatRupiah, formatDate } from '@/lib/utils'

interface ReceiptModalProps {
  expense: Expense
  onClose: () => void
}

export default function ReceiptModal({ expense, onClose }: ReceiptModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full max-h-[90vh] overflow-hidden"
        style={{
          background: 'rgba(13,13,43,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,215,0,0.12)',
          borderRadius: '24px',
          boxShadow: '0 0 60px rgba(255,215,0,0.08), 0 8px 40px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,215,0,0.08)' }}>
          <h2 className="text-base font-semibold" style={{ color: 'rgba(245,240,224,0.9)', fontFamily: 'Playfair Display, serif' }}>
            Detail Transaksi
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors"
            style={{ color: 'rgba(196,167,231,0.5)', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f5f0e0'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(196,167,231,0.5)'; e.currentTarget.style.background = 'transparent' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row overflow-auto" style={{ maxHeight: 'calc(90vh - 64px)' }}>
          {/* Receipt Image */}
          <div className="md:w-1/2 flex items-center justify-center min-h-64 p-6" style={{ background: 'rgba(26,26,62,0.4)', borderRight: '1px solid rgba(255,215,0,0.06)' }}>
            {expense.receipt_url ? (
              <div className="relative w-full" style={{ height: '288px' }}>
                <Image
                  src={expense.receipt_url}
                  alt="Resi belanja"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3" style={{ color: 'rgba(196,167,231,0.3)' }}>
                <ImageIcon size={44} />
                <p className="text-sm">Tidak ada foto resi</p>
              </div>
            )}
          </div>

          {/* Expense Details */}
          <div className="md:w-1/2 p-6 space-y-5">
            {/* Amount */}
            <div>
              <p className="label">Jumlah</p>
              <p
                className="text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #f0c040 50%, #ffd700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {formatRupiah(expense.amount)}
              </p>
            </div>

            {/* Category */}
            <div>
              <p className="label">Kategori</p>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${CATEGORIES[expense.category]?.color ?? '#8b9dc3'}20`, color: CATEGORIES[expense.category]?.color ?? '#8b9dc3', border: `1px solid ${CATEGORIES[expense.category]?.color ?? '#8b9dc3'}40` }}
              >
                {CATEGORIES[expense.category]?.label}
              </span>
            </div>

            {/* Source */}
            <div>
              <p className="label">Sumber Dana</p>
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
            </div>

            {/* Description */}
            <div>
              <p className="label">Deskripsi</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,240,224,0.7)' }}>
                {expense.description || 'Tidak ada deskripsi.'}
              </p>
            </div>

            {/* Date */}
            <div>
              <p className="label">Tanggal</p>
              <p className="text-sm" style={{ color: 'rgba(245,240,224,0.7)' }}>
                {formatDate(expense.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
