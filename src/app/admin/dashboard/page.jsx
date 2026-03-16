'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, ArrowLeft, Lock, Loader2 } from 'lucide-react'
import FeedbacksDashboard from '@/components/admin/FeedbacksDashboard'

export default function DashboardPage() {
  const [auth, setAuth]         = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch('/api/admin/session')
      .then(res => { if (res.ok) setAuth(true); })
      .finally(() => setChecking(false))
  }, [])

  if (checking) return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <p className="flex items-center gap-2 text-slate-400 text-sm">
        <Loader2 size={16} className="animate-spin" /> Vérification…
      </p>
    </main>
  )

  if (!auth) return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-4">
      <Lock size={32} className="text-slate-300" />
      <p className="text-slate-500 text-sm font-medium">Accès réservé aux administrateurs.</p>
      <Link href="/admin" className="text-sm font-bold text-[#000091] hover:underline">Se connecter →</Link>
    </main>
  )

  return (
    <main className="min-h-screen bg-slate-100" style={{ fontFamily: "'Source Sans 3', 'Trebuchet MS', sans-serif" }}>

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <section className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-[#000091] text-lg">
            <span className="w-1 h-6 rounded-sm" style={{ background: 'linear-gradient(180deg,#000091 50%,#e1000f 50%)' }} />
            Démarches Admin
          </Link>
          <Link href="/admin" className="flex items-center gap-1.5 text-sm font-bold text-[#000091] hover:underline">
            <ArrowLeft size={14} /> Retour admin
          </Link>
        </section>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="flex items-center gap-2 text-2xl font-black text-slate-800">
            <LayoutDashboard size={24} /> Dashboard — Retours utilisateurs
          </h1>
          <p className="text-sm text-slate-400 mt-1">Vue d'ensemble des avis collectés sur les tutoriels.</p>
        </header>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <FeedbacksDashboard />
        </section>
      </article>
    </main>
  )
}