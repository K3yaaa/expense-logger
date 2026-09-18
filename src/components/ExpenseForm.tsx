'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Category, Source } from '@/types'
import { formatRupiahInput } from '@/lib/utils'
import { Upload, Loader2, X, UtensilsCrossed, Bus, ShoppingBag, Film, MoreHorizontal, Sparkles } from 'lucide-react'

interface ExpenseFormProps {
  userId: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  makanan: <UtensilsCrossed size={16} />,
  transport: <Bus size={16} />,
  belanja: <ShoppingBag size={16} />,
  hiburan: <Film size={16} />,
  lain: <MoreHorizontal size={16} />,
}

const CATEGORY_LABELS: Record<Category, string> = {
  makanan: 'Makanan',
  transport: 'Transport',
  belanja: 'Belanja',
  hiburan: 'Hiburan',
  lain: 'Lainnya',
}

const CATEGORY_COLORS: Record<Category, string> = {
  makanan: '#f0c040',
  transport: '#00d4ff',
  belanja: '#c4a7e7',
  hiburan: '#ff9ecd',
  lain: '#8b9dc3',
}

const SOURCE_COLORS: Record<Source, { text: string; bg: string; border: string; glow: string }> = {
  bekal: {
    text: '#00d4ff',
    bg: 'rgba(0,212,255,0.08)',
    border: 'rgba(0,212,255,0.25)',
    glow: 'rgba(0,212,255,0.2)',
  },
  beasiswa: {
    text: '#ffd700',
    bg: 'rgba(255,215,0,0.08)',
    border: 'rgba(255,215,0,0.25)',
    glow: 'rgba(255,215,0,0.2)',
  },
  lain: {
    text: '#c4a7e7',
    bg: 'rgba(196,167,231,0.08)',
    border: 'rgba(196,167,231,0.25)',
    glow: 'rgba(196,167,231,0.2)',
  },
}

const SOURCE_LABELS: Record<Source, string> = {
  bekal: 'Bekal',
  beasiswa: 'Beasiswa',
  lain: 'Lain',
}

export default function ExpenseForm({ userId }: ExpenseFormProps) {
  const [amount, setAmount] = useState('')
  const [amountValue, setAmountValue] = useState(0)
  const [category, setCategory] = useState<Category>('makanan')
  const [source, setSource] = useState<Source>('bekal')
  const [description, setDescription] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const supabase = createClient()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    const num = parseInt(raw, 10) || 0
    setAmountValue(num)
    setAmount(formatRupiahInput(num))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Hanya file gambar yang diizinkan.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Ukuran file maksimal 5MB.')
      return
    }

    setError('')
    setReceiptFile(file)

    const reader = new FileReader()
    reader.onload = (ev) => {
      setReceiptPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeReceipt = () => {
    setReceiptFile(null)
    setReceiptPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (amountValue <= 0) {
      setError('Jumlah harus lebih dari 0.')
      return
    }

    setLoading(true)

    try {
      let receiptUrl: string | null = null

      if (receiptFile) {
        const fileExt = receiptFile.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, receiptFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          setError(`Gagal mengunggah resi: ${uploadError.message}`)
          setLoading(false)
          return
        }

        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName)

        receiptUrl = urlData.publicUrl
      }

      const { error: insertError } = await supabase.from('expenses').insert({
        user_id: userId,
        amount: amountValue,
        category,
        description: description.trim(),
        receipt_url: receiptUrl,
        source,
      })

      if (insertError) {
        setError(`Gagal menyimpan: ${insertError.message}`)
        setLoading(false)
        return
      }

      setSuccess('Pengeluaran berhasil dicatat!')
      setLoading(false)

      setAmount('')
      setAmountValue(0)
      setCategory('makanan')
      setSource('bekal')
      setDescription('')
      removeReceipt()

      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
    }
  }

  const categories = Object.keys(CATEGORY_LABELS) as Category[]
  const sources = Object.keys(SOURCE_LABELS) as Source[]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error */}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm backdrop-blur-sm" style={{ background: 'rgba(127,29,29,0.4)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5' }}>
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-xl px-4 py-3 text-sm backdrop-blur-sm" style={{ background: 'rgba(20,83,45,0.4)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac' }}>
          {success}
        </div>
      )}

      {/* Source selector - "Sumber Dana" section */}
      <div>
        <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={12} style={{ color: '#ffd700' }} />
          Sumber Dana
        </label>
        <div className="flex flex-wrap gap-3 mt-2">
          {sources.map((src) => {
            const colors = SOURCE_COLORS[src]
            const isSelected = source === src
            return (
              <button
                key={src}
                type="button"
                onClick={() => setSource(src)}
                className="source-pill"
                style={{
                  color: isSelected ? colors.text : 'rgba(255,255,255,0.4)',
                  background: isSelected ? colors.bg : 'rgba(255,255,255,0.03)',
                  borderColor: isSelected ? colors.border : 'transparent',
                  boxShadow: isSelected ? `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow.replace('0.2', '0.08')}` : 'none',
                }}
              >
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: colors.text,
                  boxShadow: `0 0 6px ${colors.text}`,
                  display: 'inline-block',
                }} />
                {SOURCE_LABELS[src]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Amount — large & prominent */}
      <div>
        <label className="label">Jumlah</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-light" style={{ color: 'rgba(255,215,0,0.4)' }}>Rp</span>
          <input
            type="text"
            inputMode="numeric"
            className="w-full rounded-xl px-4 py-5 pl-10 text-3xl font-bold input-glow"
            style={{
              background: 'rgba(26,26,62,0.6)',
              border: '1px solid rgba(45,74,140,0.4)',
              color: '#f5f0e0',
            }}
            placeholder="0"
            value={amount}
            onChange={handleAmountChange}
            required
          />
        </div>
      </div>

      {/* Category — pill selector */}
      <div>
        <label className="label">Kategori</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className="category-pill"
              style={{
                color: category === cat ? CATEGORY_COLORS[cat] : 'rgba(245,240,224,0.4)',
                borderColor: category === cat ? CATEGORY_COLORS[cat] : 'transparent',
                backgroundColor: category === cat ? `${CATEGORY_COLORS[cat]}15` : 'rgba(255,255,255,0.03)',
              }}
            >
              {CATEGORY_ICONS[cat]}
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="label">Deskripsi</label>
        <textarea
          className="input-field input-glow resize-none"
          rows={3}
          placeholder="Keterangan tambahan (opsional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
      </div>

      {/* Receipt Upload */}
      <div>
        <label className="label">Foto Resi Belanja</label>

        {!receiptPreview ? (
          <div
            className="dropzone p-8 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.1)' }}>
                <Upload size={22} style={{ color: '#ffd700' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'rgba(245,240,224,0.8)' }}>
                  Taruh foto resi di sini
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(196,167,231,0.4)' }}>
                  atau klik untuk pilih file &mdash; maks 5MB
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="receipt-preview">
              <img
                src={receiptPreview}
                alt="Preview resi belanja"
                className="w-full h-56 object-contain"
                style={{ background: 'rgba(26,26,62,0.5)' }}
              />
              <button
                type="button"
                onClick={removeReceipt}
                className="absolute top-3 right-3 text-white rounded-full p-2 transition-all backdrop-blur-sm"
                style={{ background: 'rgba(13,13,43,0.8)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#dc2626')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(13,13,43,0.8)')}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full relative overflow-hidden rounded-xl py-4 font-semibold text-gray-900 transition-all duration-200 btn-press disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #ffd700 0%, #f0c040 50%, #ffd700 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 3s ease infinite',
          boxShadow: '0 0 30px rgba(255,215,0,0.3), 0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 size={18} className="spin-slow" />
              Menyimpan...
            </>
          ) : (
            <>
              <Upload size={18} />
              Simpan Pengeluaran
            </>
          )}
        </span>
      </button>
    </form>
  )
}
