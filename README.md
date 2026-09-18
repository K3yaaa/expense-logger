# ExpenseLog - Aplikasi Pencatatan Pengeluaran

Aplikasi pencatatan pengeluaran berbasis Next.js dengan Supabase sebagai backend. UI dalam Bahasa Indonesia.

## Fitur

- **Autentikasi**: Login & register dengan email/password via Supabase Auth
- **Tambah Pengeluaran**: Jumlah (Rupiah), kategori, deskripsi, foto struk
- **Dashboard**: Ringkasan bulanan, diagram pie per kategori, diagram bar tren 6 bulan
- **Riwayat**: Daftar transaksi dengan filter kategori & bulan, hapus transaksi
- **Foto Struk**: Unggah dan lihat foto struk via Supabase Storage
- **Tema Gelap**: Dark theme dengan aksen hijau (#22c55e)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel (subdomain .vercel.app gratis)

## Setup

### 1. Buat Project Supabase

1. Buka [supabase.com](https://supabase.com) dan buat project baru
2. Buka **SQL Editor** di dashboard Supabase
3. Jalankan semua perintah SQL dari file `supabase-migration.sql`

### 2. Buat Storage Bucket

Script migration sudah otomatis membuat bucket `receipts`. Pastikan bucket `receipts`设置为 **public** di Supabase Dashboard → Storage.

### 3. Salin Environment Variables

Salin file `.env.local` dan isi dengan kredensial dari Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Cara mendapatkan kredensial:**
- Buka Supabase Dashboard → project Settings → API
- `NEXT_PUBLIC_SUPABASE_URL` → `Project URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → `anon public` key

### 4. Install & Jalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 5. Deploy ke Vercel

```bash
npm i -g vercel
vercel
```

Set environment variables di Vercel Dashboard → Settings → Environment Variables.

## Struktur Database

**Tabel: `expenses`**

| Kolom         | Tipe       | Deskripsi                          |
|---------------|------------|------------------------------------|
| id            | uuid       | Primary key                        |
| user_id       | uuid       | ID user (dari Supabase Auth)       |
| amount        | numeric    | Jumlah pengeluaran (Rupiah)          |
| category      | text       | makanan/transport/belanja/hiburan/lain |
| description   | text       | Deskripsi tambahan (opsional)      |
| receipt_url   | text       | URL foto struk (opsional)           |
| created_at    | timestamp  | Waktu dibuat                       |

**Row Level Security (RLS)** memastikan setiap user hanya bisa melihat & mengelola data miliknya sendiri.

## Kategori Pengeluaran

| Kategori   | Label     | Warna    |
|------------|-----------|----------|
| makanan    | Makanan   | Amber    |
| transport  | Transport | Blue     |
| belanja    | Belanja   | Purple   |
| hiburan    | Hiburan   | Pink     |
| lain       | Lainnya   | Gray     |

## Project Structure

```
expense-logger/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── add/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── history/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── PieChartCategory.tsx
│   │   ├── BarChartMonthly.tsx
│   │   └── ReceiptModal.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── supabase-server.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── .env.local
├── package.json
├── tailwind.config.ts
├── next.config.ts
├── postcss.config.js
├── tsconfig.json
├── supabase-migration.sql
└── README.md
```

## Lisensi

MIT
