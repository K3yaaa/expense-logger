'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Category } from '@/types'
import { formatRupiahInput } from '@/lib/utils'
import { Upload, Loader2, X, UtensilsCrossed, Bus, ShoppingBag, Film, MoreHorizontal } from 'lucide-react'

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
  makanan: '#f59e0b',
  transport: '#3b82f6',
  belanja: '#8b5cf6',
  hiburan: '#ec4899',
  lain: '#6b7280',
}

export default function ExpenseForm({ userId }: ExpenseFormProps) {
  const [amount, setAmount] = useState('')
  const [amountValue, setAmountValue] = useState(0)
  const [category, setCategory] = useState<Category>('makanan')
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error */}
      {error && (
        <div className="bg-red-950/40 border border-red-800/50 text-red-300 rounded-xl px-4 py-3 text-sm backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-950/40 border border-green-800/50 text-green-300 rounded-xl px-4 py-3 text-sm backdrop-blur-sm">
          {success}
        </div>
      )}

      {/* Amount — large & prominent */}
      <div>
        <label className="label">Jumlah</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-light">Rp</span>
          <input
            type="text"
            inputMode="numeric"
            className="w-full bg-dark-700/50 border border-dark-500 rounded-xl px-4 py-5 pl-10 text-3xl font-bold text-white placeholder-gray-600 input-glow"
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
              className="category-pill selected"
              style={{
                color: CATEGORY_COLORS[cat],
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
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Upload size={22} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">
                  Taruh foto resi di sini
                </p>
                <p className="text-xs text-gray-600 mt-1">
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
                className="w-full h-56 object-contain bg-dark-700/50"
              />
              <button
                type="button"
                onClick={removeReceipt}
                className="absolute top-3 right-3 bg-dark-900/80 hover:bg-red-600 text-white rounded-full p-2 transition-all backdrop-blur-sm"
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
        className="w-full relative overflow-hidden rounded-xl py-4 font-semibold text-dark-900 transition-all duration-200 btn-press disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-accent to-emerald-400 hover:from-emerald-400 hover:to-accent"
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
