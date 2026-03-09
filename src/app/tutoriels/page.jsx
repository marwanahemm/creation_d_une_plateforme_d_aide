"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Clock, Award,
  HeartPulse, Baby, Briefcase, FileText, ShieldCheck,
  Search, X, SlidersHorizontal,
} from "lucide-react";

const ICONS = {
  Santé: <HeartPulse size={22} />,
  Famille: <Baby size={22} />,
  Emploi: <Briefcase size={22} />,
  Fiscalité: <FileText size={22} />,
  Sécurité: <ShieldCheck size={22} />,
};

const ICON_BG = {
  Santé: "bg-[#fee2e2] text-[#dc2626]",
  Famille: "bg-[#fef3c7] text-[#d97706]",
  Emploi: "bg-[#e0e7ff] text-[#4f46e5]",
  Fiscalité: "bg-[#f5f5fe] text-[#000091]",
  Sécurité: "bg-[#b8fec9] text-[#18753c]",
};

const DIFF_COLORS = {
  "débutant": "bg-[#b8fec9] text-[#18753c]",
  "intermédiaire": "bg-[#fef3c7] text-[#92400e]",
  "avancé": "bg-[#fee2e2] text-[#991b1b]",
};

const CATEGORIES = ["Santé", "Famille", "Emploi", "Fiscalité", "Sécurité"];
const DIFFICULTES = ["débutant", "intermédiaire", "avancé"];

export default function TutorielsPage() {
  const [tutoriels, setTutoriels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categorie, setCategorie] = useState("");
  const [difficulte, setDifficulte] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchTutoriels = async (q = "", cat = "", diff = "") => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("categorie", cat);
    if (diff) params.set("difficulte", diff);

    try {
      const res = await fetch(`/api?${params.toString()}`);
      const data = await res.json();
      if (res.ok) setTutoriels(data.resultats || []);
    } catch (err) {
      console.error("Erreur:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTutoriels(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTutoriels(query, categorie, difficulte);
  };

  const handleReset = () => {
    setQuery("");
    setCategorie("");
    setDifficulte("");
    setShowFilters(false);
    fetchTutoriels();
  };

  const hasFilters = query || categorie || difficulte;

  return (
    <main className="min-h-screen bg-[#f6f6f6]" style={{ fontFamily: "'Source Sans 3', 'Trebuchet MS', Arial, sans-serif" }}>

      {/* NAV */}
      <nav className="bg-white border-b border-[#dddddd]">
        <section className="max-w-270 mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <a href="/" className="flex items-center gap-2.5 font-black text-lg text-[#000091]">
            <span className="w-1 h-7 rounded-sm" style={{ background: "linear-gradient(180deg, #000091 50%, #e1000f 50%)" }} />
            Démarches Admin
          </a>
          <a href="/" className="inline-flex items-center gap-1.5 bg-[#000091] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#1212ff] transition-colors">
            Accueil
          </a>
        </section>
      </nav>

      {/* HERO */}
      <header className="bg-[#000091] text-white py-10 px-6">
        <section className="max-w-190 mx-auto">
          <h1 className="text-3xl font-black tracking-tight mb-2">Tous les tutoriels</h1>
          <p className="text-white/75">Trouvez le guide adapté à votre démarche administrative.</p>
        </section>
      </header>

      <section className="max-w-190 mx-auto px-6 py-8">

        {/* RECHERCHE */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <label className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un tutoriel (ex: Ameli, CAF, emploi...)"
              className="w-full pl-11 pr-4 py-3 border-2 border-[#dddddd] rounded-lg text-sm focus:border-[#000091] focus:outline-none transition-colors"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold border-2 transition-colors ${
              showFilters ? "bg-[#000091] text-white border-[#000091]" : "bg-white text-[#3a3a3a] border-[#dddddd] hover:border-[#000091]"
            }`}
          >
            <SlidersHorizontal size={16} /> Filtres
          </button>
          <button type="submit" className="px-6 py-3 bg-[#000091] text-white rounded-lg text-sm font-bold hover:bg-[#1212ff] transition-colors">
            Rechercher
          </button>
        </form>

        {showFilters && (
          <aside className="flex flex-wrap gap-4 p-5 bg-white border border-[#dddddd] rounded-lg mb-4">
            <fieldset className="flex-1 min-w-50">
              <legend className="text-xs font-bold text-[#3a3a3a] mb-2">Catégorie</legend>
              <select value={categorie} onChange={(e) => setCategorie(e.target.value)} className="w-full p-2.5 border-2 border-[#dddddd] rounded-lg text-sm focus:border-[#000091] focus:outline-none">
                <option value="">Toutes</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </fieldset>
            <fieldset className="flex-1 min-w-50">
              <legend className="text-xs font-bold text-[#3a3a3a] mb-2">Difficulté</legend>
              <select value={difficulte} onChange={(e) => setDifficulte(e.target.value)} className="w-full p-2.5 border-2 border-[#dddddd] rounded-lg text-sm focus:border-[#000091] focus:outline-none">
                <option value="">Toutes</option>
                {DIFFICULTES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
            </fieldset>
          </aside>
        )}

        {hasFilters && (
          <button onClick={handleReset} className="flex items-center gap-1.5 text-sm font-bold text-[#000091] hover:underline mb-6">
            <X size={14} /> Réinitialiser
          </button>
        )}

        {/* LISTE */}
        {loading ? (
          <p className="text-center py-16 text-[#666666]">Chargement...</p>
        ) : tutoriels.length === 0 ? (
          <p className="text-center py-16 text-[#666666]">Aucun tutoriel trouvé.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0">
            {tutoriels.map((t) => (
              <li key={t.id}>
                {/* LIEN VERS /{id} et non /tutoriels/{id} */}
                <Link href={`/${t.id}`} className="block bg-white border border-[#dddddd] rounded-lg p-6 hover:border-[#000091] hover:shadow-md transition-all h-full">
                  <span className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${ICON_BG[t.categorie] || "bg-gray-100 text-gray-600"}`}>
                    {ICONS[t.categorie] || <FileText size={22} />}
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#000091] mb-1">{t.categorie}</p>
                  <h2 className="text-base font-extrabold text-[#161616] mb-2 leading-snug">{t.titre}</h2>
                  <p className="text-sm text-[#666666] mb-4 line-clamp-2">{t.description}</p>
                  <ul className="flex gap-2 flex-wrap list-none p-0">
                    {t.difficulte && (
                      <li className={`px-2.5 py-1 rounded-full text-xs font-bold ${DIFF_COLORS[t.difficulte] || "bg-gray-100 text-gray-700"}`}>
                        {t.difficulte}
                      </li>
                    )}
                    {t.duree && (
                      <li className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#f6f6f6] text-[#666666]">
                        {t.duree}
                      </li>
                    )}
                  </ul>
                  <p className="mt-4 text-sm font-bold text-[#000091]">Commencer →</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}