'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronRight, ExternalLink, Clock, Info, ImageOff, Maximize2, BookOpen,
  ArrowLeft, ArrowRight, CheckCircle2, Circle, RotateCcw, Home, PartyPopper,
} from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import FeedbackBox from '@/components/FeedbackBox'
import Footer from '@/components/Footer'
import BoutonHaut from '@/components/BoutonHaut'

// Teinte + fond pastel par catégorie (cohérent avec l'accueil et la liste)
const COULEURS = {
  'Santé':     { c: '#000091', bg: '#eef1ff' },
  'Famille':   { c: '#6f42c1', bg: '#f3edff' },
  'Emploi':    { c: '#ff6f5c', bg: '#fff0ed' },
  'Fiscalité': { c: '#18753c', bg: '#e8f5ec' },
  'Sécurité':  { c: '#d97706', bg: '#fff6e6' },
}
const DEF = { c: '#000091', bg: '#eef1ff' }

function chargerProgression(id) {
  if (typeof window === 'undefined') return []
  try {
    const brut = window.localStorage.getItem(`progression_tutoriel_${id}`)
    return brut ? JSON.parse(brut) : []
  } catch { return [] }
}
function enregistrerProgression(id, indices) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(`progression_tutoriel_${id}`, JSON.stringify(indices)) } catch {}
}

function ImageEtape({ src, numero, titreEtape, col }) {
  const [etat, setEtat] = useState('chargement')
  if (!src) return null

  if (etat === 'erreur') {
    return (
      <figure className="mt-5 mb-1">
        <div className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-12 gap-2" style={{ borderColor: col.c + '33', background: col.bg }}>
          <ImageOff size={24} style={{ color: col.c + '99' }} />
          <figcaption className="text-xs font-semibold" style={{ color: col.c + 'cc' }}>Aperçu indisponible</figcaption>
        </div>
      </figure>
    )
  }

  return (
    <figure className="mt-5 mb-1 rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #e8e8f0', boxShadow: '0 8px 24px rgba(0,0,80,0.07)' }}>
      <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ borderBottom: '1px solid #f0f0f5', background: '#f8f9fc' }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#d8d8e2' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#d8d8e2' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#d8d8e2' }} />
        <span className="ml-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: '#9a9aaa' }}>Capture — étape {numero}</span>
      </div>
      <a href={src} target="_blank" rel="noreferrer" title="Ouvrir l'image en grand" className="relative block group cursor-zoom-in" style={{ background: '#f8f9fc', minHeight: etat === 'chargement' ? '180px' : 'auto' }}>
        {etat === 'chargement' && <span className="absolute inset-0 bg-slate-100 animate-pulse block" />}
        <img
          src={src} alt={`Capture de l'étape ${numero} : ${titreEtape}`}
          onLoad={() => setEtat('ok')} onError={() => setEtat('erreur')}
          className="w-full h-auto block" style={{ opacity: etat === 'ok' ? 1 : 0, transition: 'opacity .3s' }}
        />
        {etat === 'ok' && (
          <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.92)', color: '#5b5b6b', backdropFilter: 'blur(4px)' }}>
            <Maximize2 size={13} /> Agrandir
          </span>
        )}
      </a>
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
    supabase.from('tutoriels').select('*').eq('id', Number(tutorielId)).single()
      .then(({ data }) => {
        setTutoriel(data ?? null)
        setEtapesFaites(chargerProgression(tutorielId))
        setChargement(false)
      })
  }, [tutorielId])

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

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 640) return
    carteEtapeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [indexEtapeActive])

  function basculerEtapeFaite(index) {
    setEtapesFaites(prev => {
      const suivant = prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      enregistrerProgression(tutorielId, suivant)
      return suivant
    })
  }
  function reinitialiser() {
    setEtapesFaites([]); enregistrerProgression(tutorielId, []); setIndexEtapeActive(0)
  }
  function allerEtape(index) {
    setIndexEtapeActive(index)
    setTimeout(() => carteEtapeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  if (chargement) return (
    <main className="max-w-3xl mx-auto px-5 py-10 animate-pulse" style={{ background: '#eef1fb' }}>
      <span className="block h-4 bg-slate-200 rounded w-24 mb-8" />
      <section className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e8e8f0' }}>
        <span className="block h-6 bg-slate-200 rounded w-2/3 mb-3" />
        <span className="block h-4 bg-slate-100 rounded w-full" />
      </section>
    </main>
  )

  if (!tutoriel) return (
    <main className="text-center py-20" style={{ background: '#eef1fb', minHeight: '100vh' }}>
      <p className="font-bold text-[#5b5b6b]">Guide introuvable.</p>
      <Link href="/tutoriels" className="mt-2 text-sm font-bold text-[#000091] hover:underline block">← Retour aux guides</Link>
    </main>
  )

  const { titre, categorie, duree, lien, infos, etapes } = tutoriel
  const col = COULEURS[categorie] ?? DEF

  const nbEtapes      = etapes?.length ?? 0
  const nbFaites      = etapesFaites.filter(i => i < nbEtapes).length
  const pct           = nbEtapes > 0 ? Math.round((nbFaites / nbEtapes) * 100) : 0
  const guideTermine  = nbEtapes > 0 && nbFaites === nbEtapes
  const etapeActiveFaite = etapesFaites.includes(indexEtapeActive)

  return (
    <main className="min-h-screen" style={{ background: '#eef1fb', fontFamily: "'Source Sans 3', 'Trebuchet MS', sans-serif" }}>

      {/* ── Barre ── */}
      <nav className="sticky top-0 z-20" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8e8f0' }}>
        <section className="w-full px-6 sm:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: 'linear-gradient(135deg,#000091,#2d2dff)', boxShadow: '0 4px 12px rgba(0,0,145,0.25)' }}>
              <BookOpen size={18} />
            </span>
            <span className="font-black text-[#1a1a2e] text-base leading-none">
              Plateforme d&apos;aide administrative
              <span className="block text-[10px] font-semibold text-[#8a8a9a] tracking-wide mt-0.5">Guides pas à pas, gratuits</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm font-bold text-[#000091] hover:underline">
            <Home size={15} /> Accueil
          </Link>
        </section>
      </nav>

      {/* ── Bandeau coloré du guide ── */}
      <header className="relative overflow-hidden" style={{ background: `radial-gradient(ellipse 70% 90% at 50% -30%, ${col.c}1f, transparent 60%), linear-gradient(180deg,#eaf0ff,#eef1fb)` }}>
        <div className="max-w-3xl mx-auto px-5 pt-6 pb-2">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-[#8a8a9a] mb-5 flex-wrap">
            <Link href="/" className="flex items-center gap-1 hover:text-[#000091] transition-colors"><Home size={14} /> Accueil</Link>
            <ChevronRight size={13} />
            <Link href="/tutoriels" className="hover:text-[#000091] transition-colors">Guides</Link>
            <ChevronRight size={13} />
            <span className="text-[#5b5b6b] font-semibold line-clamp-1">{titre}</span>
          </nav>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-5 pb-10">

        {/* ── En-tête du guide ── */}
        <header className="bg-white rounded-2xl p-6 mb-5 -mt-1" style={{ border: '1px solid #e8e8f0', boxShadow: '0 8px 30px rgba(0,0,80,0.06)' }}>
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide" style={{ background: col.bg, color: col.c }}>{categorie}</span>
            {duree && <span className="flex items-center gap-1 text-xs font-semibold text-[#8a8a9a]"><Clock size={12} /> {duree}</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] tracking-tight">{titre}</h1>

          {nbEtapes > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#5b5b6b]">{nbFaites} / {nbEtapes} étape{nbEtapes > 1 ? 's' : ''} terminée{nbFaites > 1 ? 's' : ''}</span>
                <span className="flex items-center gap-2.5">
                  <span className="text-xs font-black" style={{ color: col.c }}>{pct} %</span>
                  {nbFaites > 0 && (
                    <button onClick={reinitialiser} className="flex items-center gap-1 text-xs font-semibold text-[#8a8a9a] hover:text-[#5b5b6b] transition-colors" title="Remettre à zéro">
                      <RotateCcw size={11} /> Réinitialiser
                    </button>
                  )}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: '#e3e6f3' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: col.c }} />
              </div>
            </div>
          )}
        </header>

        {/* ── Infos ── */}
        {infos?.length > 0 && (
          <aside className="rounded-2xl p-5 mb-5" style={{ background: col.bg, border: `1px solid ${col.c}22` }}>
            <h2 className="flex items-center gap-2 text-sm font-black mb-3" style={{ color: col.c }}>
              <Info size={15} /> À savoir avant de commencer
            </h2>
            <ul className="space-y-2 list-none p-0">
              {infos.map((info, i) => (
                <li key={i} className="flex gap-2.5 text-sm" style={{ color: '#3a3a4e' }}>
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: col.c }} />
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* ── Sommaire ── */}
        {nbEtapes > 1 && (
          <nav className="bg-white rounded-2xl p-4 mb-5" style={{ border: '1px solid #e8e8f0' }}>
            <p className="text-xs font-bold uppercase tracking-wide text-[#8a8a9a] mb-2 px-1">Les étapes</p>
            <ol className="flex flex-col gap-0.5 list-none p-0 m-0">
              {etapes.map((etape, index) => {
                const faite = etapesFaites.includes(index)
                const active = index === indexEtapeActive
                return (
                  <li key={index}>
                    <button onClick={() => allerEtape(index)} className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors"
                      style={active ? { background: col.c, color: '#fff', fontWeight: 700 } : { color: '#5b5b6b' }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f6f7fc' }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                      {faite
                        ? <CheckCircle2 size={16} className="shrink-0" style={{ color: active ? '#fff' : '#18753c' }} />
                        : <Circle size={16} className="shrink-0" style={{ color: active ? 'rgba(255,255,255,.6)' : '#cbcbd8' }} />}
                      <span className="shrink-0 text-xs font-black opacity-70">{index + 1}.</span>
                      <span className="line-clamp-1">{etape.titre}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>
        )}

        {/* ── Étape active ── */}
        {nbEtapes > 0 && (
          <article ref={carteEtapeRef} className="bg-white rounded-2xl p-6 scroll-mt-20" style={{ border: '1px solid #e8e8f0', boxShadow: '0 8px 30px rgba(0,0,80,0.06)' }}>
            <header className="flex items-center justify-between gap-3 mb-4">
              <span className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0" style={{ background: col.c }}>{indexEtapeActive + 1}</span>
                <h2 className="font-black text-[#1a1a2e] text-lg">{etapes[indexEtapeActive].titre}</h2>
              </span>
              <span className="text-xs font-bold text-[#8a8a9a] shrink-0 hidden sm:block">Étape {indexEtapeActive + 1} / {nbEtapes} · ← → pour naviguer</span>
              <span className="text-xs font-bold text-[#8a8a9a] shrink-0 sm:hidden">{indexEtapeActive + 1} / {nbEtapes}</span>
            </header>

            <p className="text-[#3a3a4e] leading-relaxed">{etapes[indexEtapeActive].description}</p>

            <ImageEtape src={etapes[indexEtapeActive].image} numero={indexEtapeActive + 1} titreEtape={etapes[indexEtapeActive].titre} col={col} />

            <div className="mt-5">
              <button onClick={() => basculerEtapeFaite(indexEtapeActive)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black border-2 transition-all"
                style={etapeActiveFaite
                  ? { background: '#e8f5ec', borderColor: '#a8dab8', color: '#18753c' }
                  : { background: '#fff', borderColor: '#e8e8f0', color: '#5b5b6b' }}>
                {etapeActiveFaite ? <><CheckCircle2 size={16} /> Étape terminée</> : <><Circle size={16} /> Marquer cette étape comme faite</>}
              </button>
            </div>

            <nav className="mt-6 flex items-center justify-between pt-5 gap-3" style={{ borderTop: '1px solid #f0f0f5' }}>
              <button onClick={() => setIndexEtapeActive(i => Math.max(0, i - 1))} disabled={indexEtapeActive === 0}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: '#f6f7fc', color: '#5b5b6b' }}>
                <ArrowLeft size={14} /> Précédent
              </button>
              <button onClick={() => {
                  if (!etapesFaites.includes(indexEtapeActive)) basculerEtapeFaite(indexEtapeActive)
                  setIndexEtapeActive(i => Math.min(nbEtapes - 1, i + 1))
                }} disabled={indexEtapeActive === nbEtapes - 1}
                className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: col.c }}>
                Suivant <ArrowRight size={14} />
              </button>
            </nav>
          </article>
        )}

        {/* ── Fin ── */}
        {guideTermine && (
          <aside className="mt-5 rounded-2xl p-6 text-center" style={{ background: '#e8f5ec', border: '1px solid #a8dab8' }}>
            <PartyPopper size={32} className="text-[#18753c] mx-auto mb-2" />
            <p className="font-black text-[#18753c] text-lg mb-1">Bravo, vous avez terminé ce guide !</p>
            <p className="text-sm text-[#2c7a4b] mb-4">Vous pouvez maintenant réaliser votre démarche sur le site officiel.</p>
            {lien && (
              <a href={lien} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white" style={{ background: col.c }}>
                Accéder au site officiel <ExternalLink size={14} />
              </a>
            )}
          </aside>
        )}

        {lien && !guideTermine && (
          <div className="mt-5 flex justify-center">
            <a href={lien} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white transition-transform hover:-translate-y-0.5" style={{ background: col.c, boxShadow: `0 6px 18px ${col.c}33` }}>
              Accéder au site officiel <ExternalLink size={14} />
            </a>
          </div>
        )}

        <FeedbackBox tutorielId={tutoriel.id} couleur={col.c} />
      </article>

      <Footer />
      <BoutonHaut />
    </main>
  )
}