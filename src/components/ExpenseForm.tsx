'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CATEGORIES, Category } from '@/types'
import { formatRupiahInput, parseRupiahInput } from '@/lib/utils'
import { Upload, Loader2, X, ImageIcon } from 'lucide-react'

interface ExpenseFormProps {
  userId: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

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

      // Upload receipt if exists
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
          setError(`Gagal mengunggah struk: ${uploadError.message}`)
          setLoading(false)
          return
        }

        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName)

        receiptUrl = urlData.publicUrl
      }

      // Insert expense record
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

      // Reset form
      setAmount('')
      setAmountValue(0)
      setCategory('makanan')
      setDescription('')
      removeReceipt()

      // Redirect after short delay
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-900/30 border border-green-700 text-green-300 rounded-lg px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {/* Amount */}
      <div>
        <label className="label">Jumlah (Rupiah) *</label>
        <input
          type="text"
          inputMode="numeric"
          className="input-field text-lg font-semibold"
          placeholder="0"
          value={amount}
          onChange={handleAmountChange}
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="label">Kategori *</label>
        <select
          className="input-field cursor-pointer"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {Object.entries(CATEGORIES).map(([key, info]) => (
            <option key={key} value={key}>
              {info.icon} {info.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="label">Deskripsi</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Keterangan tambahan (opsional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
      </div>

      {/* Receipt Upload */}
      <div>
        <label className="label">Unggah Struk (opsional)</label>

        {!receiptPreview ? (
          <div
            className="border-2 border-dashed border-dark-500 rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto mb-2 text-gray-500" size={32} />
            <p className="text-sm text-gray-400">
              Klik untuk mengunggah gambar struk
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Maks 5MB, format gambar
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="relative inline-block w-full">
            <div className="border border-dark-500 rounded-lg overflow-hidden">
              <img
                src={receiptPreview}
                alt="Preview struk"
                className="w-full h-48 object-contain bg-dark-700"
              />
            </div>
            <button
              type="button"
              onClick={removeReceipt}
              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Upload size={18} />
        )}
        {loading ? 'Menyimpan...' : 'Simpan Pengeluaran'}
      </button>
    </form>
  )
}
