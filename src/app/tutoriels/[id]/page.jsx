'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ExternalLink, Clock, Info, ImageOff, ArrowLeft, ArrowRight } from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import FeedbackBox from '@/components/FeedbackBox'

const COULEURS_PAR_CATEGORIE = {
  Santé:     '#0d6efd',
  Famille:   '#6f42c1',
  Emploi:    '#e63946',
}

function ImageEtape({ src, alt, couleur }) {
  const [etat, setEtat] = useState('chargement')
  if (!src) return null
  return (
    <figure className="mt-4 mb-2">
      {etat === 'erreur' ? (
        <figcaption
          className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-12 gap-2"
          style={{ borderColor: couleur + '40', background: couleur + '08' }}
        >
          <ImageOff size={24} style={{ color: couleur + '80' }} />
          <span className="text-xs" style={{ color: couleur + '99' }}>{alt}</span>
        </figcaption>
      ) : (
        <a href={src} target="_blank" rel="noreferrer" title="Cliquer pour agrandir"
          className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md block group cursor-zoom-in"
          style={{ minHeight: etat === 'chargement' ? '180px' : 'auto' }}
        >
          {etat === 'chargement' && <span className="absolute inset-0 bg-slate-100 animate-pulse rounded-2xl block" />}
          <img
            src={src} alt={alt}
            onLoad={() => setEtat('ok')}
            onError={() => setEtat('erreur')}
            className="w-full h-auto block rounded-2xl transition-transform duration-200 group-hover:scale-[1.01]"
            style={{ opacity: etat === 'ok' ? 1 : 0, transition: 'opacity .3s' }}
          />
          {etat === 'ok' && (
            <figcaption
              className="absolute bottom-0 left-0 right-0 px-4 py-2 text-xs text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,.6))' }}
            >
              <span>{alt}</span>
              <span className="opacity-70 text-[10px]">🔍 Cliquer pour agrandir</span>
            </figcaption>
          )}
        </a>
      )}
    </figure>
  )
}

export default function TutorielDetailPage({ params }) {
  const [tutorielId, setTutorielId]             = useState(null)
  const [tutoriel, setTutoriel]                 = useState(null)
  const [chargement, setChargement]             = useState(true)
  const [indexEtapeActive, setIndexEtapeActive] = useState(0)

  useEffect(() => {
    params.then ? params.then(p => setTutorielId(p.id)) : setTutorielId(params.id)
  }, [params])

  useEffect(() => {
    if (!tutorielId) return
    supabase
      .from('tutoriels')
      .select('*')
      .eq('id', Number(tutorielId))
      .single()
      .then(({ data }) => {
        setTutoriel(data ?? null)
        setChargement(false)
      })
  }, [tutorielId])

  if (chargement) return (
    <main className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
      <span className="block h-4 bg-slate-200 rounded w-24 mb-8" />
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <span className="block h-6 bg-slate-200 rounded w-2/3 mb-3" />
        <span className="block h-4 bg-slate-100 rounded w-full" />
      </section>
    </main>
  )

  if (!tutoriel) return (
    <main className="text-center py-20 text-slate-400">
      <p className="font-medium">Tutoriel non trouvé.</p>
      <Link href="/tutoriels" className="mt-2 text-sm text-[#000091] hover:underline block">← Retour aux guides</Link>
    </main>
  )

  const { titre, categorie, duree, lien, infos, etapes } = tutoriel
  const couleur = COULEURS_PAR_CATEGORIE[categorie] ?? '#000091'

  return (
    <main className="min-h-screen bg-[#f8f9fc]">

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <section className="max-w-3xl mx-auto px-4 py-3">
          <Link href="/tutoriels" className="flex items-center gap-2 font-black text-[#000091] text-lg w-fit">
            <span className="w-1 h-6 rounded-sm" style={{ background: 'linear-gradient(180deg,#000091 50%,#e1000f 50%)' }} />
            Les guides
          </Link>
        </section>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-8">

        <Link href="/tutoriels" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ChevronLeft size={15} /> Retour aux guides
        </Link>

        <header className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
          <span className="block w-full h-1.5 rounded-full mb-5" style={{ backgroundColor: couleur }} />
          <p className="flex items-center gap-3 flex-wrap mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{categorie}</span>
            {duree && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={12} /> {duree}
              </span>
            )}
          </p>
          <h1 className="text-2xl font-black text-slate-900">{titre}</h1>
        </header>

        {infos?.length > 0 && (
          <aside className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-3">
              <Info size={15} /> À savoir avant de commencer
            </h2>
            <ul className="space-y-1.5 list-none p-0">
              {infos.map((info, index) => (
                <li key={index} className="flex gap-2 text-sm text-blue-700">
                  <span className="mt-0.5 shrink-0">•</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {etapes?.length > 0 && (
          <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <header className="flex items-center justify-between gap-3 mb-4">
              <span className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: couleur }}>
                  {indexEtapeActive + 1}
                </span>
                <h2 className="font-bold text-slate-800">{etapes[indexEtapeActive].titre}</h2>
              </span>
              <span className="text-xs font-semibold text-slate-400 shrink-0">
                Étape {indexEtapeActive + 1} / {etapes.length}
              </span>
            </header>

            <p className="text-slate-600 text-sm leading-relaxed">{etapes[indexEtapeActive].description}</p>

            <ImageEtape
              src={etapes[indexEtapeActive].image}
              alt={`Étape ${indexEtapeActive + 1} — ${etapes[indexEtapeActive].titre}`}
              couleur={couleur}
            />

            <nav className="mt-6 flex items-center justify-between pt-5 border-t border-slate-100 gap-3">
              <button
                onClick={() => setIndexEtapeActive(i => Math.max(0, i - 1))}
                disabled={indexEtapeActive === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={14} /> Précédent
              </button>
              <button
                onClick={() => setIndexEtapeActive(i => Math.min(etapes.length - 1, i + 1))}
                disabled={indexEtapeActive === etapes.length - 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                style={{ backgroundColor: couleur }}
              >
                Suivant <ArrowRight size={14} />
              </button>
            </nav>
          </article>
        )}

        {lien && (
          <nav className="mt-6 flex justify-center">
            <a
              href={lien} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90"
              style={{ backgroundColor: couleur }}
            >
              Accéder au site officiel <ExternalLink size={14} />
            </a>
          </nav>
        )}

        <FeedbackBox tutorielId={tutoriel.id} couleur={couleur} />

      </article>
    </main>
  )
}