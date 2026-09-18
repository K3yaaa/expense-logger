import { createClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import { redirect } from 'next/navigation'

export default async function HistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar userEmail={user.email} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
