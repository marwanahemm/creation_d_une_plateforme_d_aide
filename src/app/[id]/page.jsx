'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, ExternalLink, CheckCircle, Circle,
  Clock, Gauge, ArrowLeft, ArrowRight, Info, ImageOff
} from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import FeedbackBox from '@/components/FeedbackBox'

const COULEURS = {
  Santé:     '#0d6efd',
  Famille:   '#6f42c1',
  Emploi:    '#e63946',
  Fiscalité: '#2a9d8f',
  Sécurité:  '#f4a261',
}

const DIFF_STYLE = {
  'débutant':      'text-green-700 bg-green-50 border border-green-100',
  'intermédiaire': 'text-orange-700 bg-orange-50 border border-orange-100',
  'avancé':        'text-red-700 bg-red-50 border border-red-100',
}

function Capture({ src, alt, couleur }) {
  const [etat, setEtat] = useState('loading')
  if (!src) return null
  return (
    <figure className="-mx-6 mt-6 mb-0">
      {etat === 'error' ? (
        <div
          className="flex flex-col items-center justify-center py-14 gap-2"
          style={{ borderColor: couleur + '40', background: couleur + '08' }}
        >
          <ImageOff size={28} style={{ color: couleur + '80' }} />
          <span className="text-xs" style={{ color: couleur + '99' }}>{alt}</span>
        </div>
      ) : (
        <span className="relative overflow-hidden border-y border-slate-200 block"
          style={{ background: '#f8f9fc' }}>
          {etat === 'loading' && (
            <span className="block bg-slate-100 animate-pulse" style={{ height: '240px' }} />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setEtat('ok')}
            onError={() => setEtat('error')}
            className="w-full h-auto block"
            style={{ opacity: etat === 'ok' ? 1 : 0, transition: 'opacity .3s' }}
          />
          {etat === 'ok' && (
            <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-2 text-xs text-white"
              style={{ background: 'linear-gradient(transparent,rgba(0,0,0,.6))' }}>
              {alt}
            </figcaption>
          )}
        </span>
      )}
    </figure>
  )
}

export default function TutorielDetail({ params }) {
  const [id, setId] = useState(null)
  const [tutoriel, setTutoriel]       = useState(null)
  const [chargement, setChargement]   = useState(true)
  const [etapeActive, setEtapeActive] = useState(0)
  const [cochees, setCochees]         = useState(new Set())

  useEffect(() => {
    params.then ? params.then(p => setId(p.id)) : setId(params.id)
  }, [params])

  useEffect(() => {
    if (!id) return
    supabase
      .from('tutoriels')
      .select('*')
      .eq('id', Number(id))
      .single()
      .then(({ data }) => { setTutoriel(data ?? null); setChargement(false) })
  }, [id])

  function toggleEtape(i) {
    setCochees(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  if (chargement) return (
    <main className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
      <span className="block h-4 bg-slate-200 rounded w-24 mb-8" />
      <article className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <span className="block h-6 bg-slate-200 rounded w-2/3 mb-3" />
        <span className="block h-4 bg-slate-100 rounded w-full" />
      </article>
    </main>
  )

  if (!tutoriel) return (
    <main className="text-center py-20 text-slate-400">
      <p className="font-medium">Tutoriel non trouvé</p>
      <Link href="/tutoriels" className="mt-2 text-sm text-[#000091] hover:underline block">← Retour aux tutoriels</Link>
    </main>
  )

  const { titre, categorie, difficulte, duree, lien, infos, etapes } = tutoriel
  const couleur    = COULEURS[categorie] ?? '#000091'
  const badgeStyle = DIFF_STYLE[difficulte] ?? 'text-slate-700 bg-slate-100'
  const termine    = etapes?.length > 0 && cochees.size === etapes.length

  return (
    <main className="min-h-screen bg-[#f8f9fc]" style={{ fontFamily: "'Marianne', Arial, sans-serif" }}>

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <section className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-[#000091] text-lg">
            <span className="w-1 h-6 rounded-sm" style={{ background: 'linear-gradient(180deg,#000091 50%,#e1000f 50%)' }} />
            Démarches Admin
          </Link>
          <Link href="/" className="text-sm font-bold text-[#000091] hover:underline">Accueil</Link>
        </section>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">

        <Link href="/tutoriels" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ChevronLeft size={15} /> Retour aux tutoriels
        </Link>

        {/* En-tête */}
        <header className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
          <span className="block w-full h-1.5 rounded-full mb-5" style={{ backgroundColor: couleur }} />
          <p className="flex items-center gap-3 flex-wrap mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{categorie}</span>
            {difficulte && (
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${badgeStyle}`}>
                <Gauge size={11} /> {difficulte}
              </span>
            )}
            {duree && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={12} /> {duree}
              </span>
            )}
          </p>
          <h1 className="text-2xl font-black text-slate-900">{titre}</h1>
        </header>

        {/* Infos utiles */}
        {infos?.length > 0 && (
          <aside className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-3">
              <Info size={15} /> À savoir avant de commencer
            </h2>
            <ul className="space-y-1.5 list-none p-0">
              {infos.map((info, i) => (
                <li key={i} className="flex gap-2 text-sm text-blue-700">
                  <span className="mt-0.5 shrink-0">•</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Sidebar + contenu */}
        {etapes?.length > 0 && (
          <section className="grid md:grid-cols-[240px_1fr] gap-5">

            <aside>
              <nav className="bg-white border border-slate-200 rounded-2xl p-4 sticky top-20">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Étapes</p>
                <ul className="space-y-1 list-none p-0">
                  {etapes.map((e, i) => (
                    <li key={i}>
                      <button
                        onClick={() => setEtapeActive(i)}
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                          etapeActive === i ? 'text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                        style={etapeActive === i ? { background: couleur } : {}}
                      >
                        {cochees.has(i)
                          ? <CheckCircle size={14} className="shrink-0" style={{ color: etapeActive === i ? 'white' : '#22c55e' }} />
                          : <Circle size={14} className="shrink-0" style={{ color: etapeActive === i ? 'rgba(255,255,255,.6)' : '#cbd5e1' }} />
                        }
                        <span className="line-clamp-2 leading-snug">{e.titre}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <section>
              <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <header className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: couleur }}>
                    {etapeActive + 1}
                  </span>
                  <h2 className="font-bold text-slate-800 text-base">{etapes[etapeActive].titre}</h2>
                </header>

                <p className="text-slate-600 leading-relaxed text-sm mb-2">{etapes[etapeActive].description}</p>

                <Capture
                  src={etapes[etapeActive].image}
                  alt={`Capture étape ${etapeActive + 1} — ${etapes[etapeActive].titre}`}
                  couleur={couleur}
                />

                <footer className="mt-6 flex items-center justify-between pt-5 border-t border-slate-100 flex-wrap gap-3">
                  <button
                    onClick={() => toggleEtape(etapeActive)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      cochees.has(etapeActive)
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle size={14} />
                    {cochees.has(etapeActive) ? 'Fait ✓' : 'Marquer comme fait'}
                  </button>
                  <p className="flex gap-4 m-0">
                    <button
                      onClick={() => setEtapeActive(p => Math.max(0, p - 1))}
                      disabled={etapeActive === 0}
                      className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowLeft size={14} /> Précédent
                    </button>
                    <button
                      onClick={() => setEtapeActive(p => Math.min(etapes.length - 1, p + 1))}
                      disabled={etapeActive === etapes.length - 1}
                      className="flex items-center gap-1 text-sm font-semibold hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      style={{ color: couleur }}
                    >
                      Suivant <ArrowRight size={14} />
                    </button>
                  </p>
                </footer>
              </article>

              {termine && (
                <aside className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                  <CheckCircle size={28} className="text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-green-800 mb-1">Bravo, vous avez terminé ce tutoriel !</p>
                </aside>
              )}

              {lien && (
                <div className="mt-4 flex justify-center">
                  <a href={lien} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: couleur }}>
                    <ExternalLink size={15} />
                    Accéder au site officiel
                  </a>
                </div>
              )}

              <FeedbackBox tutorielId={tutoriel.id} couleur={couleur} />
            </section>
          </section>
        )}
      </article>
    </main>
  )
}