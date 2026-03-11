'use client'

import { useState } from 'react'
import FeedbacksDashboard from '@/components/admin/FeedbacksDashboard'

export default function AdminPage() {
  const [onglet, setOnglet] = useState('feedbacks')

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard admin</h1>
        <p className="text-sm text-slate-400 mt-1">Vue d'ensemble de la plateforme</p>
      </header>

      {/* Onglets */}
      <nav className="flex gap-2 mb-6">
        <button
          onClick={() => setOnglet('feedbacks')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            onglet === 'feedbacks'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Feedbacks
        </button>
      </nav>

      {/* Contenu */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        {onglet === 'feedbacks' && <FeedbacksDashboard />}
      </section>
    </main>
  )
}