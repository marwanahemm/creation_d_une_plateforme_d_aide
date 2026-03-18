'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, Heart } from 'lucide-react'

// --- Helpers pour lire les cookies côté client ---

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookieClient(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`
}

export default function FeedbackBox({ tutorielId, couleur }) {

  const [dejaVote, setDejaVote]       = useState(false)
  const [reponse, setReponse]         = useState(null)
  const [loading, setLoading]         = useState(false)
  const [commentaire, setCommentaire] = useState('')
  const [envoye, setEnvoye]           = useState(false)

  const cookieName = `feedback_${tutorielId}`

  // --- Au chargement : vérifie si un cookie de vote existe ---

  useEffect(() => {
    const saved = getCookie(cookieName)
    if (saved !== null) {
      setDejaVote(true)
      setReponse(saved === 'true')
    }

    const commentaireSaved = getCookie(`${cookieName}_commentaire`)
    if (commentaireSaved) {
      setEnvoye(true)
    }
  }, [cookieName])

  // --- Vote ---

  const handleVote = async (utile) => {
    setLoading(true)
    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutoriel_id: tutorielId, utile }),
      })
      if (res.ok) {
        // Le cookie posé par le serveur dans la réponse,
        // met aussi à jour l'état local
        setDejaVote(true)
        setReponse(utile)
      } else if (res.status === 409) {
        // Déjà voté (cookie côté serveur détecté)
        setDejaVote(true)
      }
    } catch (err) {
      console.error('Erreur feedback:', err)
    }
    setLoading(false)
  }

  // --- Commentaire ---

  const handleCommentaire = async () => {
    if (!commentaire.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutoriel_id: tutorielId,
          utile: reponse,
          commentaire,
        }),
      })
      if (res.ok) {
        setEnvoye(true)
        // Le cookie commentaire est posé par le serveur
      }
    } catch (err) {
      console.error('Erreur commentaire:', err)
    }
    setLoading(false)
  }

  // --- Passer le commentaire (sans envoyer) ---

  const handlePasser = () => {
    setCookieClient(`${cookieName}_commentaire`, 'true')
    setEnvoye(true)
  }

  // --- Après vote : propose un commentaire ou affiche les remerciements ---

  if (dejaVote) {
    if (!envoye) {
      return (
        <aside className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
          <Heart size={22} className="mx-auto mb-2" style={{ color: couleur }} />
          <p className="text-sm font-semibold text-slate-700 mb-1">Merci pour votre retour !</p>
          <p className="text-xs text-slate-400 mb-3">
            Vous avez trouvé ce tutoriel {reponse ? 'utile' : 'pas utile'}.
          </p>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Un commentaire à ajouter ? (optionnel)"
            rows={3}
            className="w-full text-sm border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
          />
          <button
            onClick={handleCommentaire}
            disabled={loading}
            className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: couleur }}
          >
            Envoyer
          </button>
          <button
            onClick={handlePasser}
            className="mt-2 ml-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Passer
          </button>
        </aside>
      )
    }

    return (
      <aside className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
        <Heart size={22} className="mx-auto mb-2" style={{ color: couleur }} />
        <p className="text-sm font-semibold text-slate-700">Merci pour votre retour !</p>
        <p className="text-xs text-slate-400 mt-1">
          Vous avez trouvé ce tutoriel {reponse ? 'utile' : 'pas utile'}.
        </p>
      </aside>
    )
  }

  // --- État initial : boutons de vote ---

  return (
    <aside className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
      <p className="text-sm font-semibold text-slate-700 mb-3">
        Ce tutoriel vous a été utile ?
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => handleVote(true)}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-green-300 text-green-700 bg-green-50 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all disabled:opacity-50"
        >
          <ThumbsUp size={16} /> Oui
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-red-300 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-50"
        >
          <ThumbsDown size={16} /> Non
        </button>
      </div>
    </aside>
  )
}