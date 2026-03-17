'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Clock, Award, Search, HeartPulse, Baby, Briefcase, FileText, ShieldCheck } from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import PropositionBox from '@/components/PropositionBox'

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

const DIFF_STYLE = {
  'débutant':      'bg-green-50 text-green-700 border border-green-200',
  'intermédiaire': 'bg-orange-50 text-orange-700 border border-orange-200',
  'avancé':        'bg-red-50 text-red-700 border border-red-200',
}

export default function TutorielsPage() {
  const [tutoriels, setTutoriels]   = useState([])
  const [recherche, setRecherche]   = useState('')
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    supabase
      .from('tutoriels')
      .select('*')
      .order('id')
      .then(({ data }) => { setTutoriels(data ?? []); setChargement(false) })
  }, [])

  const resultats = tutoriels.filter(t => {
    const q = recherche.toLowerCase()
    return (
      t.titre.toLowerCase().includes(q) ||
      t.categorie?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
    )
  })

  return (
    <main className="min-h-screen bg-[#f8f9fc]" style={{ fontFamily: "'Source Sans 3', 'Trebuchet MS', sans-serif" }}>

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <section className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-[#000091] text-lg">
            <span className="w-1 h-6 rounded-sm" style={{ background: 'linear-gradient(180deg,#000091 50%,#e1000f 50%)' }} />
            Démarches Admin
          </Link>
          <Link href="/" className="text-sm font-bold text-[#000091] hover:underline">Accueil</Link>
        </section>
      </nav>

      <header className="bg-[#000091] text-white py-10 px-4">
        <section className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-black mb-1">Tutoriels</h1>
          <p className="text-white/70">Guides pas à pas pour vos démarches administratives en ligne.</p>
          <label className="mt-5 relative max-w-md flex items-center">
            <Search size={16} className="absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un tutoriel..."
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-slate-800 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#000091]"
            />
          </label>
        </section>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-8">

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
                      </header>
                      <h2 className="font-extrabold text-slate-900 mb-2 group-hover:text-[#000091] transition-colors">{t.titre}</h2>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-1">{t.description}</p>
                      <footer className="flex gap-2 flex-wrap">
                        {t.difficulte && (
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${DIFF_STYLE[t.difficulte] ?? 'bg-slate-100 text-slate-600'}`}>
                            <Award size={10} /> {t.difficulte}
                          </span>
                        )}
                        {t.duree && (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 bg-slate-100 text-slate-500">
                            <Clock size={10} /> {t.duree}
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
            Aucun tutoriel pour "{recherche}"
            <button onClick={() => setRecherche('')} className="block mt-2 text-sm text-[#000091] hover:underline mx-auto">
              Effacer la recherche
            </button>
          </p>
        )}

        {/* Proposition de tutoriel */}
        {!chargement && (
          <section className="mt-10 max-w-lg mx-auto">
            <PropositionBox />
          </section>
        )}
      </section>
    </main>
  )
}