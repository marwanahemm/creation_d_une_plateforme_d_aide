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
  Santé:     <HeartPulse size={22} />,
  Famille:   <Baby size={22} />,
  Emploi:    <Briefcase size={22} />,
  Fiscalité: <FileText size={22} />,
  Sécurité:  <ShieldCheck size={22} />,
}

const COULEURS = {
  Santé:     '#0d6efd',
  Famille:   '#6f42c1',
  Emploi:    '#e63946',
  Fiscalité: '#2a9d8f',
  Sécurité:  '#f4a261',
}

// Lit la progression sauvegardée localement pour afficher un badge sur la carte.
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
  const [progressions, setProgressions] = useState({}) // { [id]: nbEtapesFaites }
  const champRechercheRef = useRef(null)

  // Raccourci clavier : « / » met le focus sur la recherche.
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
        // Charge les progressions locales une fois les tutoriels connus.
        const map = {}
        liste.forEach(t => { map[t.id] = lireProgression(t.id) })
        setProgressions(map)
        setChargement(false)
      })
  }, [])

  // Catégories réellement présentes dans les données.
  const categories = ['Toutes', ...Array.from(new Set(tutoriels.map(t => t.categorie).filter(Boolean)))]

  const resultats = tutoriels.filter(t => {
    const q = recherche.toLowerCase()
    const correspondRecherche =
      t.titre.toLowerCase().includes(q) ||
      t.categorie?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
    const correspondCategorie = categorieActive === 'Toutes' || t.categorie === categorieActive
    return correspondRecherche && correspondCategorie
  })

  return (
    <main className="min-h-screen bg-[#f8f9fc]" style={{ fontFamily: "'Source Sans 3', 'Trebuchet MS', sans-serif" }}>

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <section className="w-full px-6 sm:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg,#000091,#1a1aa8)' }}>
              <BookOpen size={18} />
            </span>
            <span className="font-black text-[#000091] text-lg leading-none">
              Les guides
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">Démarches administratives</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm font-bold text-[#000091] hover:underline">
            <Home size={15} /> Accueil
          </Link>
        </section>
      </nav>

      <header className="bg-[#000091] text-white py-10 px-4">
        <section className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-black mb-1">Guides</h1>
          <p className="text-white/70">Guides pas à pas pour vos démarches administratives en ligne.</p>
          <label className="mt-5 relative max-w-md flex items-center">
            <Search size={16} className="absolute left-3 text-slate-400" />
            <input
              ref={champRechercheRef}
              type="text"
              placeholder="Rechercher un guide..."
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              className="w-full pl-9 pr-20 py-2.5 rounded-xl text-sm text-slate-800 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#000091]"
            />
            {recherche ? (
              <button
                type="button"
                onClick={() => { setRecherche(''); champRechercheRef.current?.focus() }}
                aria-label="Effacer la recherche"
                className="absolute right-3 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={16} />
              </button>
            ) : (
              <kbd className="absolute right-3 hidden sm:flex items-center justify-center w-5 h-5 rounded border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-400">/</kbd>
            )}
          </label>
        </section>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-8">

        {/* Filtres par catégorie */}
        {!chargement && categories.length > 1 && (
          <nav className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => {
              const active = cat === categorieActive
              const couleur = cat === 'Toutes' ? '#000091' : (COULEURS[cat] ?? '#000091')
              return (
                <button
                  key={cat}
                  onClick={() => setCategorieActive(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    active ? 'text-white border-transparent' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                  style={active ? { backgroundColor: couleur } : {}}
                >
                  {cat === 'Toutes'
                    ? <Layers size={15} />
                    : <span className={active ? 'text-white' : ''} style={!active ? { color: couleur } : {}}>{ICONS[cat] ?? <FileText size={15} />}</span>
                  }
                  {cat}
                </button>
              )
            })}
          </nav>
        )}

        {/* Compteur de résultats */}
        {!chargement && (
          <p className="text-sm text-slate-400 mb-4">
            {resultats.length} guide{resultats.length > 1 ? 's' : ''}
            {categorieActive !== 'Toutes' && <> dans <span className="font-semibold text-slate-500">{categorieActive}</span></>}
          </p>
        )}

        {chargement && (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
                <span className="block h-1.5 rounded-full bg-slate-200 mb-5 w-full" />
                <span className="block h-3 bg-slate-100 rounded w-1/3 mb-2" />
                <span className="block h-5 bg-slate-200 rounded w-3/4 mb-3" />
                <span className="block h-3 bg-slate-100 rounded w-full mb-1" />
                <span className="block h-3 bg-slate-100 rounded w-2/3" />
              </li>
            ))}
          </ul>
        )}

        {!chargement && resultats.length > 0 && (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0">
            {resultats.map(t => {
              const couleur = COULEURS[t.categorie] ?? '#000091'
              const nbEtapes = Array.isArray(t.etapes) ? t.etapes.length : 0
              const nbFaites = Math.min(progressions[t.id] || 0, nbEtapes)
              const termine = nbEtapes > 0 && nbFaites === nbEtapes
              const commence = nbFaites > 0 && !termine
              const pourcentage = nbEtapes > 0 ? Math.round((nbFaites / nbEtapes) * 100) : 0
              return (
                <li key={t.id}>
                  <Link
                    href={`/tutoriels/${t.id}`}
                    className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full"
                  >
                    <span className="h-1.5 w-full block" style={{ backgroundColor: couleur }} />
                    <article className="p-5 flex flex-col flex-1">
                      <header className="flex items-center gap-2 mb-3">
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: couleur }}>
                          {ICONS[t.categorie] ?? <FileText size={18} />}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{t.categorie}</span>
                        {termine && (
                          <span className="ml-auto flex items-center gap-1 text-xs font-bold text-green-600">
                            <CheckCircle2 size={13} /> Fait
                          </span>
                        )}
                      </header>
                      <h2 className="font-extrabold text-slate-900 mb-2 group-hover:text-[#000091] transition-colors">{t.titre}</h2>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-1">{t.description}</p>

                      {/* Progression en cours */}
                      {commence && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-semibold text-slate-400">Repris : {nbFaites}/{nbEtapes}</span>
                            <span className="text-[11px] font-bold" style={{ color: couleur }}>{pourcentage} %</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pourcentage}%`, backgroundColor: couleur }} />
                          </div>
                        </div>
                      )}

                      <footer className="flex gap-2 flex-wrap">
                        {t.duree && (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 bg-slate-100 text-slate-500">
                            <Clock size={10} /> {t.duree}
                          </span>
                        )}
                        {nbEtapes > 0 && (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 bg-slate-100 text-slate-500">
                            <Layers size={10} /> {nbEtapes} étape{nbEtapes > 1 ? 's' : ''}
                          </span>
                        )}
                      </footer>
                    </article>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}

        {!chargement && resultats.length === 0 && (
          <p className="text-center py-20 text-slate-400">
            <BookOpen size={40} className="text-slate-300 mx-auto mb-4" />
            Aucun guide {recherche && <>pour &laquo; {recherche} &raquo;</>}
            {categorieActive !== 'Toutes' && <> dans {categorieActive}</>}
            <button
              onClick={() => { setRecherche(''); setCategorieActive('Toutes') }}
              className="block mt-2 text-sm text-[#000091] hover:underline mx-auto"
            >
              Réinitialiser les filtres
            </button>
          </p>
        )}

        {!chargement && (
          <section className="mt-10 max-w-lg mx-auto">
            <PropositionBox />
          </section>
        )}
      </section>

      <Footer />
      <BoutonHaut />
    </main>
  )
}