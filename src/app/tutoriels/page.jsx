'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  BookOpen, Clock, Search, HeartPulse, Baby, Briefcase,
  FileText, ShieldCheck, Layers, CheckCircle2, X, Home,
} from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import PropositionBox from '@/components/PropositionBox'
import Footer from '@/components/Footer'
import BoutonHaut from '@/components/BoutonHaut'

const ICONS = {
  'Santé':     <HeartPulse size={20} />,
  'Famille':   <Baby size={20} />,
  'Emploi':    <Briefcase size={20} />,
  'Fiscalité': <FileText size={20} />,
  'Sécurité':  <ShieldCheck size={20} />,
}

// Teinte + fond pastel par catégorie (cohérent avec l'accueil)
const COULEURS = {
  'Santé':     { c: '#000091', bg: '#eef1ff' },
  'Famille':   { c: '#6f42c1', bg: '#f3edff' },
  'Emploi':    { c: '#ff6f5c', bg: '#fff0ed' },
  'Fiscalité': { c: '#18753c', bg: '#e8f5ec' },
  'Sécurité':  { c: '#d97706', bg: '#fff6e6' },
}
const DEF = { c: '#000091', bg: '#eef1ff' }

function lireProgression(id) {
  if (typeof window === 'undefined') return 0
  try {
    const brut = window.localStorage.getItem(`progression_tutoriel_${id}`)
    const arr = brut ? JSON.parse(brut) : []
    return Array.isArray(arr) ? arr.length : 0
  } catch { return 0 }
}

export default function TutorielsPage() {
  const [tutoriels, setTutoriels]       = useState([])
  const [recherche, setRecherche]       = useState(() => {
    if (typeof window === 'undefined') return ''
    return new URLSearchParams(window.location.search).get('q') || ''
  })
  const [categorieActive, setCategorieActive] = useState('Toutes')
  const [chargement, setChargement]     = useState(true)
  const [progressions, setProgressions] = useState({})
  const champRechercheRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        champRechercheRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    supabase
      .from('tutoriels')
      .select('*')
      .order('id')
      .then(({ data }) => {
        const liste = data ?? []
        setTutoriels(liste)
        const map = {}
        liste.forEach(t => { map[t.id] = lireProgression(t.id) })
        setProgressions(map)
        setChargement(false)
      })
  }, [])

  const categories = ['Toutes', ...Array.from(new Set(tutoriels.map(t => t.categorie).filter(Boolean)))]

  const resultats = tutoriels.filter(t => {
    const q = recherche.toLowerCase()
    const okRech =
      t.titre.toLowerCase().includes(q) ||
      t.categorie?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
    const okCat = categorieActive === 'Toutes' || t.categorie === categorieActive
    return okRech && okCat
  })

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

      {/* ── Hero léger ── */}
      <header className="relative overflow-hidden" style={{ background: 'radial-gradient(ellipse 70% 80% at 50% -20%, rgba(45,45,255,0.12), transparent 60%), linear-gradient(180deg,#eaf0ff,#eef1fb)' }}>
        <section className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#5b5b6b] mb-4" style={{ background: '#fff', border: '1px solid #e8e8f0' }}>
            <BookOpen size={13} className="text-[#000091]" /> Tous les guides
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1a1a2e] tracking-tight">Quelle démarche aujourd&apos;hui&nbsp;?</h1>
          <p className="mt-3 text-[#5b5b6b] max-w-xl">Choisissez un guide, suivez les étapes à votre rythme, et accédez au site officiel.</p>

          <label className="mt-6 relative max-w-lg flex items-center bg-white rounded-2xl px-4 py-1" style={{ border: '1px solid #e8e8f0', boxShadow: '0 12px 40px rgba(0,0,80,0.10)' }}>
            <Search size={18} className="text-[#8a8a9a]" />
            <input
              ref={champRechercheRef}
              type="text"
              placeholder="Rechercher (Ameli, CAF, France Travail…)"
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm text-[#1a1a2e] bg-transparent outline-none placeholder:text-[#8a8a9a] min-w-0"
            />
            {recherche ? (
              <button type="button" onClick={() => { setRecherche(''); champRechercheRef.current?.focus() }} aria-label="Effacer" className="text-[#8a8a9a] hover:text-[#1a1a2e]">
                <X size={16} />
              </button>
            ) : (
              <kbd className="hidden sm:flex items-center justify-center w-5 h-5 rounded border text-[11px] font-semibold text-[#8a8a9a]" style={{ borderColor: '#e8e8f0', background: '#f6f7fc' }}>/</kbd>
            )}
          </label>
        </section>
      </header>

      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-10">

        {/* ── Filtres ── */}
        {!chargement && categories.length > 1 && (
          <nav className="flex flex-wrap gap-2 mb-5">
            {categories.map(cat => {
              const active = cat === categorieActive
              const col = cat === 'Toutes' ? DEF : (COULEURS[cat] ?? DEF)
              return (
                <button
                  key={cat}
                  onClick={() => setCategorieActive(cat)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border transition-all"
                  style={active
                    ? { background: col.c, color: '#fff', borderColor: 'transparent', boxShadow: '0 6px 16px rgba(0,0,80,0.15)' }
                    : { background: '#fff', color: '#5b5b6b', borderColor: '#e8e8f0' }}
                >
                  {cat === 'Toutes'
                    ? <Layers size={15} />
                    : <span style={active ? { color: '#fff' } : { color: col.c }}>{ICONS[cat] ?? <FileText size={15} />}</span>}
                  {cat}
                </button>
              )
            })}
          </nav>
        )}

        {!chargement && (
          <p className="text-sm text-[#8a8a9a] mb-5">
            {resultats.length} guide{resultats.length > 1 ? 's' : ''}
            {categorieActive !== 'Toutes' && <> dans <span className="font-bold text-[#5b5b6b]">{categorieActive}</span></>}
          </p>
        )}

        {/* ── Chargement ── */}
        {chargement && (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="bg-white rounded-2xl p-6 animate-pulse" style={{ border: '1px solid #e8e8f0' }}>
                <span className="block w-11 h-11 rounded-xl bg-slate-100 mb-4" />
                <span className="block h-3 bg-slate-100 rounded w-1/3 mb-2" />
                <span className="block h-5 bg-slate-200 rounded w-3/4 mb-3" />
                <span className="block h-3 bg-slate-100 rounded w-full mb-1" />
                <span className="block h-3 bg-slate-100 rounded w-2/3" />
              </li>
            ))}
          </ul>
        )}

        {/* ── Cartes ── */}
        {!chargement && resultats.length > 0 && (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
            {resultats.map(t => {
              const col = COULEURS[t.categorie] ?? DEF
              const nbEtapes = Array.isArray(t.etapes) ? t.etapes.length : 0
              const nbFaites = Math.min(progressions[t.id] || 0, nbEtapes)
              const termine = nbEtapes > 0 && nbFaites === nbEtapes
              const commence = nbFaites > 0 && !termine
              const pct = nbEtapes > 0 ? Math.round((nbFaites / nbEtapes) * 100) : 0
              return (
                <li key={t.id}>
                  <Link
                    href={`/tutoriels/${t.id}`}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden h-full transition-all duration-200"
                    style={{ border: '1px solid #e8e8f0' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 38px rgba(0,0,80,0.12)'; e.currentTarget.style.borderColor = 'transparent' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#e8e8f0' }}
                  >
                    <span className="h-1.5 w-full block" style={{ background: col.c }} />
                    <article className="p-5 flex flex-col flex-1">
                      <header className="flex items-center gap-2.5 mb-3">
                        <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: col.bg, color: col.c }}>
                          {ICONS[t.categorie] ?? <FileText size={18} />}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide text-[#8a8a9a]">{t.categorie}</span>
                        {termine && (
                          <span className="ml-auto flex items-center gap-1 text-xs font-bold text-[#18753c]">
                            <CheckCircle2 size={13} /> Fait
                          </span>
                        )}
                      </header>
                      <h2 className="font-extrabold text-[#1a1a2e] text-lg mb-2 group-hover:text-[#000091] transition-colors">{t.titre}</h2>
                      <p className="text-sm text-[#5b5b6b] leading-relaxed mb-4 line-clamp-2 flex-1">{t.description}</p>

                      {commence && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-[#8a8a9a]">Repris : {nbFaites}/{nbEtapes}</span>
                            <span className="text-[11px] font-black" style={{ color: col.c }}>{pct} %</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: '#eef1fb' }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: col.c }} />
                          </div>
                        </div>
                      )}

                      <footer className="flex gap-2 flex-wrap items-center">
                        {t.duree && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 text-[#5b5b6b]" style={{ background: '#eef1fb' }}>
                            <Clock size={10} /> {t.duree}
                          </span>
                        )}
                        {nbEtapes > 0 && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 text-[#5b5b6b]" style={{ background: '#eef1fb' }}>
                            <Layers size={10} /> {nbEtapes} étape{nbEtapes > 1 ? 's' : ''}
                          </span>
                        )}
                        <span className="ml-auto text-sm font-black flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: col.c }}>
                          Commencer →
                        </span>
                      </footer>
                    </article>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}

        {/* ── Vide ── */}
        {!chargement && resultats.length === 0 && (
          <div className="text-center py-20 text-[#8a8a9a]">
            <BookOpen size={40} className="text-slate-300 mx-auto mb-4" />
            <p>Aucun guide {recherche && <>pour &laquo; {recherche} &raquo;</>}{categorieActive !== 'Toutes' && <> dans {categorieActive}</>}</p>
            <button
              onClick={() => { setRecherche(''); setCategorieActive('Toutes') }}
              className="mt-2 text-sm font-bold text-[#000091] hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {!chargement && (
          <section className="mt-12 max-w-lg mx-auto">
            <PropositionBox />
          </section>
        )}
      </section>

      <Footer />
      <BoutonHaut />
    </main>
  )
}