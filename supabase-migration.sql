-- ============================================================
-- ExpenseLog Database Setup
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- 1. Buat tabel expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL CHECK (category IN ('makanan', 'transport', 'belanja', 'hiburan', 'lain')),
  description TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 3. Buat policies agar user hanya bisa melihat/mengelola data miliknya sendiri
DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
CREATE POLICY "Users can view own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own expenses" ON expenses;
CREATE POLICY "Users can insert own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;
CREATE POLICY "Users can delete own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Buat index untuk performa query
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- ============================================================
-- Supabase Storage Setup (jalankan di SQL Editor juga)
-- ============================================================
-- Buat bucket 'receipts' untuk menyimpan foto struk
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Policy untuk upload receipt (user hanya bisa upload file miliknya)
DROP POLICY IF EXISTS "Anyone can upload receipts" ON storage.objects;
CREATE POLICY "Anyone can upload receipts" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy untuk public read
DROP POLICY IF EXISTS "Anyone can view receipts" ON storage.objects;
CREATE POLICY "Anyone can view receipts" ON storage.objects
  FOR SELECT USING (bucket_id = 'receipts');

-- Policy untuk delete
DROP POLICY IF EXISTS "Users can delete own receipts" ON storage.objects;
CREATE POLICY "Users can delete own receipts" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
