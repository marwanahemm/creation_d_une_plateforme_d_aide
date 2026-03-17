'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Loader2, Eye, CheckCircle, Clock } from 'lucide-react'

const STATUT_STYLE = {
  nouvelle: { label: 'Nouvelle',  couleur: 'bg-amber-100 text-amber-700',  icon: <Clock size={12} /> },
  lue:      { label: 'Lue',       couleur: 'bg-blue-100 text-blue-700',    icon: <Eye size={12} /> },
  traitée:  { label: 'Traitée',   couleur: 'bg-green-100 text-green-700',  icon: <CheckCircle size={12} /> },
}

export default function PropositionsDashboard() {
  const [propositions, setPropositions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [erreur, setErreur]             = useState(null)

  const fetchPropositions = async () => {
    try {
      const res = await fetch('/api/admin/propositions')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Erreur ${res.status}`)
      }
      const data = await res.json()
      setPropositions(data.propositions || [])
    } catch (err) {
      setErreur(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPropositions() }, [])

  const changerStatut = async (id, statut) => {
    try {
      const res = await fetch('/api/admin/propositions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, statut }),
      })
      if (res.ok) {
        setPropositions(prev =>
          prev.map(p => p.id === id ? { ...p, statut } : p)
        )
      }
    } catch (err) {
      console.error('Erreur changement statut:', err)
    }
  }

  if (loading) return (
    <p className="flex items-center justify-center gap-2 py-12 text-slate-400 text-sm">
      <Loader2 size={16} className="animate-spin" /> Chargement des propositions…
    </p>
  )

  if (erreur) return (
    <p className="text-center py-12 text-red-500 text-sm">{erreur}</p>
  )

  const nbNouvelles = propositions.filter(p => p.statut === 'nouvelle').length

  return (
    <section>
      {/* Résumé */}
      <ul className="grid grid-cols-3 gap-4 mb-6 list-none p-0">
        <li className="bg-slate-50 rounded-xl p-5 text-center">
          <Lightbulb size={20} className="mx-auto mb-2 text-amber-500" />
          <p className="text-2xl font-black text-slate-800">{propositions.length}</p>
          <p className="text-xs text-slate-400 mt-1">Total</p>
        </li>
        <li className="bg-amber-50 rounded-xl p-5 text-center">
          <Clock size={20} className="mx-auto mb-2 text-amber-500" />
          <p className="text-2xl font-black text-amber-600">{nbNouvelles}</p>
          <p className="text-xs text-slate-400 mt-1">Nouvelles</p>
        </li>
        <li className="bg-green-50 rounded-xl p-5 text-center">
          <CheckCircle size={20} className="mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-black text-green-600">
            {propositions.filter(p => p.statut === 'traitée').length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Traitées</p>
        </li>
      </ul>

      {/* Liste */}
      {propositions.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">Aucune proposition reçue.</p>
      ) : (
        <ul className="space-y-2 list-none p-0">
          {propositions.map(p => {
            const style = STATUT_STYLE[p.statut] || STATUT_STYLE.nouvelle
            return (
              <li key={p.id} className="bg-slate-50 rounded-xl px-5 py-4">
                <header className="flex items-start justify-between gap-4 mb-2">
                  <article className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{p.sujet}</p>
                    {p.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                    )}
                    <p className="text-xs text-slate-300 mt-2">
                      {new Date(p.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </article>

                  <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${style.couleur}`}>
                    {style.icon} {style.label}
                  </span>
                </header>

                <footer className="flex gap-2 mt-3">
                  {p.statut === 'nouvelle' && (
                    <button
                      onClick={() => changerStatut(p.id, 'lue')}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Eye size={12} /> Marquer comme lue
                    </button>
                  )}
                  {p.statut !== 'traitée' && (
                    <button
                      onClick={() => changerStatut(p.id, 'traitée')}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-200 text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle size={12} /> Marquer comme traitée
                    </button>
                  )}
                  {p.statut === 'traitée' && (
                    <button
                      onClick={() => changerStatut(p.id, 'nouvelle')}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                      <Clock size={12} /> Remettre en nouvelle
                    </button>
                  )}
                </footer>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}