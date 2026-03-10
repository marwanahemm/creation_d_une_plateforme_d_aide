'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, Heart } from 'lucide-react'

export default function FeedbackBox({ tutorielId, couleur }) {

  // --- États ---

  const [dejaVote, setDejaVote] = useState(false)
  const [reponse, setReponse]   = useState(null)
  const [loading, setLoading]   = useState(false)

  // Clé localStorage pour savoir si l'utilisateur a déjà voté sur CE tutoriel
  const storageKey = `feedback_${tutorielId}`


  // --- Vérification au chargement si l'utilisateur a déjà voté ---

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) {
      setDejaVote(true)
      setReponse(saved === 'true')
    }
  }, [storageKey])


  // --- Envoyoi du vote ---

  const handleVote = async (utile) => {
    setLoading(true)

    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutoriel_id: tutorielId,
          utile,
        }),
      })

      if (res.ok) {
        // Sauvegarde en localStorage pour ne pas revote
        localStorage.setItem(storageKey, String(utile))
        setDejaVote(true)
        setReponse(utile)
      }
    } catch (err) {
      console.error('Erreur feedback:', err)
    }

    setLoading(false)
  }


  // --- Si déjà voté, afficher un message de remerciement ---

  if (dejaVote) {
    return (
      <aside className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
        <Heart size={22} className="mx-auto mb-2" style={{ color: couleur }} />
        <p className="text-sm font-semibold text-slate-700">
          Merci pour votre retour !
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Vous avez trouvé ce tutoriel {reponse ? 'utile' : 'pas utile'}.
        </p>
      </aside>
    )
  }


  // --- Affiche les boutons de vote ---

  return (
    <aside className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
      <p className="text-sm font-semibold text-slate-700 mb-3">
        Ce tutoriel vous a été utile ?
      </p>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => handleVote(true)}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-green-200 text-green-700 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50"
        >
          <ThumbsUp size={16} />
          Oui
        </button>

        <button
          onClick={() => handleVote(false)}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          <ThumbsDown size={16} />
          Non
        </button>
      </div>
    </aside>
  )
}