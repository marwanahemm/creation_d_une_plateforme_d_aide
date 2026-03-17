'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, BarChart3, Loader2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import supabase from '@/lib/supabaseClient'

export default function FeedbacksDashboard() {
  const [feedbacks, setFeedbacks]   = useState({})
  const [tutoriels, setTutoriels]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [erreur, setErreur]         = useState(null)
  const [expanded, setExpanded]     = useState({})

  const toggleExpanded = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  useEffect(() => {
    async function fetchData() {
      try {
        const resFb = await fetch('/api/admin/feedbacks')
        if (!resFb.ok) throw new Error('Non autorisé')
        const dataFb = await resFb.json()

        const { data: tutos, error: tutoError } = await supabase
          .from('tutoriels')
          .select('id, titre, categorie')
          .order('id')
        if (tutoError) throw new Error(tutoError.message)

        setFeedbacks(dataFb.feedbacks || {})
        setTutoriels(tutos || [])
      } catch (err) {
        setErreur(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <p className="flex items-center justify-center gap-2 py-12 text-slate-400 text-sm">
      <Loader2 size={16} className="animate-spin" /> Chargement des retours…
    </p>
  )

  if (erreur) return (
    <p className="text-center py-12 text-red-500 text-sm">
      {erreur === 'Non autorisé'
        ? 'Connectez-vous sur /admin pour accéder aux feedbacks.'
        : `Erreur : ${erreur}`}
    </p>
  )

  const totalPositifs = Object.values(feedbacks).reduce((s, f) => s + (f.positifs || 0), 0)
  const totalNegatifs = Object.values(feedbacks).reduce((s, f) => s + (f.negatifs || 0), 0)
  const totalVotes = totalPositifs + totalNegatifs

  const lignes = tutoriels.map(t => {
    const fb = feedbacks[t.id] || { positifs: 0, negatifs: 0 }
    const total = fb.positifs + fb.negatifs
    const pct = total > 0 ? Math.round((fb.positifs / total) * 100) : null
    return { ...t, ...fb, total, pct }
  }).sort((a, b) => b.total - a.total)

  return (
    <section>

      {/* Cartes résumé */}
      <ul className="grid grid-cols-3 gap-4 mb-8 list-none p-0">
        <li className="bg-slate-50 rounded-xl p-5 text-center">
          <BarChart3 size={20} className="mx-auto mb-2 text-slate-400" />
          <p className="text-2xl font-black text-slate-800">{totalVotes}</p>
          <p className="text-xs text-slate-400 mt-1">Votes au total</p>
        </li>
        <li className="bg-green-50 rounded-xl p-5 text-center">
          <ThumbsUp size={20} className="mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-black text-green-600">{totalPositifs}</p>
          <p className="text-xs text-slate-400 mt-1">Avis positifs</p>
        </li>
        <li className="bg-red-50 rounded-xl p-5 text-center">
          <ThumbsDown size={20} className="mx-auto mb-2 text-red-400" />
          <p className="text-2xl font-black text-red-500">{totalNegatifs}</p>
          <p className="text-xs text-slate-400 mt-1">Avis négatifs</p>
        </li>
      </ul>

      {/* Détail par tutoriel */}
      <h3 className="text-sm font-bold text-slate-700 mb-3">Détail par tutoriel</h3>

      {lignes.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">Aucun tutoriel trouvé.</p>
      ) : (
        <ul className="space-y-2 list-none p-0">
          {lignes.map(t => {
            const commentaires = t.commentaires || []
            const isOpen = !!expanded[t.id]
            return (
              <li key={t.id} className="bg-slate-50 rounded-xl overflow-hidden">
                {/* Ligne principale */}
                <div className="px-5 py-4 flex items-center gap-4">
                  <article className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{t.titre}</p>
                    <p className="text-xs text-slate-400">{t.categorie}</p>
                  </article>

                  {t.total > 0 ? (
                    <section className="flex items-center gap-3 shrink-0">
                      <span className="w-32 h-2 bg-red-100 rounded-full overflow-hidden">
                        <span className="block h-full bg-green-400 rounded-full" style={{ width: `${t.pct}%` }} />
                      </span>
                      <span className="text-xs font-bold text-slate-600 w-10 text-right">{t.pct}%</span>
                    </section>
                  ) : (
                    <span className="text-xs text-slate-300 shrink-0">Aucun vote</span>
                  )}

                  <nav className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                      <ThumbsUp size={12} /> {t.positifs}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-500">
                      <ThumbsDown size={12} /> {t.negatifs}
                    </span>
                  </nav>

                  {commentaires.length > 0 && (
                    <button
                      onClick={() => toggleExpanded(t.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 shrink-0 transition-colors"
                    >
                      <MessageSquare size={13} />
                      {commentaires.length}
                      {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  )}
                </div>

                {/* Commentaires dépliables */}
                {isOpen && commentaires.length > 0 && (
                  <ul className="border-t border-slate-200 px-5 py-3 space-y-2 list-none">
                    {commentaires.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                        <span className={`mt-0.5 shrink-0 ${c.utile ? 'text-green-500' : 'text-red-400'}`}>
                          {c.utile ? <ThumbsUp size={13} /> : <ThumbsDown size={13} />}
                        </span>
                        <article className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700">{c.texte}</p>
                          <p className="text-xs text-slate-300 mt-1">
                            {new Date(c.date).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'long', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </article>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}