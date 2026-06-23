'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronRight, ExternalLink, Clock, Info, ImageOff,
  ArrowLeft, ArrowRight, CheckCircle2, Circle, RotateCcw, Home,
} from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import FeedbackBox from '@/components/FeedbackBox'
import Footer from '@/components/Footer'
import BoutonHaut from '@/components/BoutonHaut'

const COULEURS_PAR_CATEGORIE = {
  Santé:     '#0d6efd',
  Famille:   '#6f42c1',
  Emploi:    '#e63946',
  Fiscalité: '#2a9d8f',
  Sécurité:  '#f4a261',
}

// Sauvegarde de la progression dans le navigateur de l'usager.
function chargerProgression(id) {
  if (typeof window === 'undefined') return []
  try {
    const brut = window.localStorage.getItem(`progression_tutoriel_${id}`)
    return brut ? JSON.parse(brut) : []
  } catch { return [] }
}

function enregistrerProgression(id, indices) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(`progression_tutoriel_${id}`, JSON.stringify(indices))
  } catch { /* quota plein ou navigation privée : on ignore */ }
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
  const [etapesFaites, setEtapesFaites]         = useState([])
  const carteEtapeRef = useRef(null)

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
        setEtapesFaites(chargerProgression(tutorielId))
        setChargement(false)
      })
  }, [tutorielId])

  // Navigation au clavier entre les étapes (flèches gauche / droite).
  useEffect(() => {
    const nb = tutoriel?.etapes?.length ?? 0
    if (nb === 0) return
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight') setIndexEtapeActive(i => Math.min(nb - 1, i + 1))
      if (e.key === 'ArrowLeft')  setIndexEtapeActive(i => Math.max(0, i - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tutoriel])

  // Sur petit écran, on ramène la carte de l'étape en vue quand elle change.
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 640) return
    carteEtapeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [indexEtapeActive])

  function basculerEtapeFaite(index) {
    setEtapesFaites(prev => {
      const suivant = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
      enregistrerProgression(tutorielId, suivant)
      return suivant
    })
  }

  function reinitialiser() {
    setEtapesFaites([])
    enregistrerProgression(tutorielId, [])
    setIndexEtapeActive(0)
  }

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

  const nbEtapes      = etapes?.length ?? 0
  const nbFaites      = etapesFaites.filter(i => i < nbEtapes).length
  const pourcentage   = nbEtapes > 0 ? Math.round((nbFaites / nbEtapes) * 100) : 0
  const etapeActiveFaite = etapesFaites.includes(indexEtapeActive)

  return (
    <main className="min-h-screen bg-[#f8f9fc]" style={{ fontFamily: "'Source Sans 3', 'Trebuchet MS', sans-serif" }}>

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <section className="max-w-3xl mx-auto px-4 py-3">
          <Link href="/tutoriels" className="flex items-center gap-2 font-black text-[#000091] text-lg w-fit">
            <span className="w-1 h-6 rounded-sm" style={{ background: 'linear-gradient(180deg,#000091 50%,#e1000f 50%)' }} />
            Les guides
          </Link>
        </section>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-8">

        <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="flex items-center gap-1 hover:text-[#000091] transition-colors">
            <Home size={14} /> Accueil
          </Link>
          <ChevronRight size={13} className="shrink-0" />
          <Link href="/tutoriels" className="hover:text-[#000091] transition-colors">Guides</Link>
          <ChevronRight size={13} className="shrink-0" />
          <span className="text-slate-600 font-medium line-clamp-1">{titre}</span>
        </nav>

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

          {nbEtapes > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-500">
                  {nbFaites} / {nbEtapes} étape{nbEtapes > 1 ? 's' : ''} terminée{nbFaites > 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: couleur }}>{pourcentage} %</span>
                  {nbFaites > 0 && (
                    <button
                      onClick={reinitialiser}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
                      title="Remettre la progression à zéro"
                    >
                      <RotateCcw size={11} /> Réinitialiser
                    </button>
                  )}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pourcentage}%`, backgroundColor: couleur }}
                />
              </div>
            </div>
          )}
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

        {nbEtapes > 1 && (
          <nav className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2 px-1">Les étapes</p>
            <ol className="flex flex-col gap-0.5 list-none p-0 m-0">
              {etapes.map((etape, index) => {
                const faite = etapesFaites.includes(index)
                const active = index === indexEtapeActive
                return (
                  <li key={index}>
                    <button
                      onClick={() => setIndexEtapeActive(index)}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                        active ? 'font-semibold text-white' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      style={active ? { backgroundColor: couleur } : {}}
                    >
                      {faite
                        ? <CheckCircle2 size={16} className="shrink-0" style={{ color: active ? 'white' : '#22c55e' }} />
                        : <Circle size={16} className="shrink-0" style={{ color: active ? 'rgba(255,255,255,.6)' : '#cbd5e1' }} />
                      }
                      <span className="shrink-0 text-xs font-bold opacity-70">{index + 1}.</span>
                      <span className="line-clamp-1">{etape.titre}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>
        )}

        {nbEtapes > 0 && (
          <article ref={carteEtapeRef} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm scroll-mt-20">
            <header className="flex items-center justify-between gap-3 mb-4">
              <span className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: couleur }}>
                  {indexEtapeActive + 1}
                </span>
                <h2 className="font-bold text-slate-800">{etapes[indexEtapeActive].titre}</h2>
              </span>
              <span className="text-xs font-semibold text-slate-400 shrink-0 hidden sm:block">
                Étape {indexEtapeActive + 1} / {nbEtapes} · ← → pour naviguer
              </span>
              <span className="text-xs font-semibold text-slate-400 shrink-0 sm:hidden">
                {indexEtapeActive + 1} / {nbEtapes}
              </span>
            </header>

            <p className="text-slate-600 text-sm leading-relaxed">{etapes[indexEtapeActive].description}</p>

            <ImageEtape
              src={etapes[indexEtapeActive].image}
              alt={`Étape ${indexEtapeActive + 1} — ${etapes[indexEtapeActive].titre}`}
              couleur={couleur}
            />

            <div className="mt-5">
              <button
                onClick={() => basculerEtapeFaite(indexEtapeActive)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                  etapeActiveFaite
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {etapeActiveFaite
                  ? <><CheckCircle2 size={16} /> Étape terminée</>
                  : <><Circle size={16} /> Marquer cette étape comme faite</>
                }
              </button>
            </div>

            <nav className="mt-6 flex items-center justify-between pt-5 border-t border-slate-100 gap-3">
              <button
                onClick={() => setIndexEtapeActive(i => Math.max(0, i - 1))}
                disabled={indexEtapeActive === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={14} /> Précédent
              </button>
              <button
                onClick={() => {
                  if (!etapesFaites.includes(indexEtapeActive)) basculerEtapeFaite(indexEtapeActive)
                  setIndexEtapeActive(i => Math.min(nbEtapes - 1, i + 1))
                }}
                disabled={indexEtapeActive === nbEtapes - 1}
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

      <Footer />
      <BoutonHaut />
    </main>
  )
}