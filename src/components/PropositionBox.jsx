'use client'

import { useState } from 'react'
import { Lightbulb, Send, CheckCircle } from 'lucide-react'

export default function PropositionBox() {
  const [ouvert, setOuvert]   = useState(false)
  const [sujet, setSujet]     = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [envoye, setEnvoye]   = useState(false)
  const [erreur, setErreur]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!sujet.trim()) return

    setLoading(true)
    setErreur('')

    try {
      const res = await fetch('/api/propositions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sujet: sujet.trim(), description: description.trim() }),
      })

      if (res.ok) {
        setEnvoye(true)
        setSujet('')
        setDescription('')
      } else {
        const data = await res.json()
        setErreur(data.error || 'Une erreur est survenue.')
      }
    } catch {
      setErreur('Impossible d\'envoyer la proposition.')
    }

    setLoading(false)
  }

  if (envoye) {
    return (
      <aside className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
        <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
        <p className="text-sm font-semibold text-green-800">Merci pour votre suggestion !</p>
        <p className="text-xs text-green-600 mt-1">Nous la prendrons en compte pour les prochains tutoriels.</p>
      </aside>
    )
  }

  if (!ouvert) {
    return (
      <aside className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
        <Lightbulb size={22} className="text-amber-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700 mb-1">
          Un tutoriel vous manque ?
        </p>
        <p className="text-xs text-slate-400 mb-3">
          Proposez un sujet et nous essaierons de le créer.
        </p>
        <button
          onClick={() => setOuvert(true)}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#000091] hover:bg-[#1212ff] transition-colors"
        >
          Proposer un tutoriel
        </button>
      </aside>
    )
  }

  return (
    <aside className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <header className="flex items-center gap-2 mb-4">
        <Lightbulb size={18} className="text-amber-500" />
        <h3 className="text-sm font-bold text-slate-700">Proposer un tutoriel</h3>
      </header>

      <form onSubmit={handleSubmit}>
        <label className="block mb-3">
          <span className="block text-xs font-semibold text-slate-600 mb-1">
            Sujet *
          </span>
          <input
            type="text"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            placeholder="Ex : Comment déclarer ses impôts en ligne"
            maxLength={200}
            required
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#000091] placeholder:text-slate-400"
          />
        </label>

        <label className="block mb-4">
          <span className="block text-xs font-semibold text-slate-600 mb-1">
            Description <span className="font-normal text-slate-400">(optionnel)</span>
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez la démarche que vous aimeriez voir expliquée..."
            maxLength={1000}
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#000091] placeholder:text-slate-400"
          />
        </label>

        {erreur && <p className="text-xs text-red-500 mb-3">{erreur}</p>}

        <footer className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !sujet.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#000091] hover:bg-[#1212ff] transition-colors disabled:opacity-50"
          >
            <Send size={14} />
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
          <button
            type="button"
            onClick={() => { setOuvert(false); setSujet(''); setDescription(''); setErreur(''); }}
            className="px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Annuler
          </button>
        </footer>
      </form>
    </aside>
  )
}