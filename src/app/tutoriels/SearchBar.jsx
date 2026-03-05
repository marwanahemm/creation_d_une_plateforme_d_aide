"use client";

import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";


// =============================================
//  Catégories et difficultés
// =============================================

const CATEGORIES = ["Santé", "Famille", "Emploi", "Fiscalité", "Sécurité"];

const DIFFICULTES = ["débutant", "intermédiaire", "avancé"];


// =============================================
//  Composant SearchBar
// =============================================

export default function SearchBar({ onResults, onReset }) {

  // --- États ---

  const [query, setQuery]           = useState("");
  const [categorie, setCategorie]   = useState("");
  const [difficulte, setDifficulte] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading]       = useState(false);


  // --- Lancement de la recherche ---

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);

    // Construction de l'URL avec les paramètres
    const params = new URLSearchParams();

    if (query)      params.set("q", query);
    if (categorie)  params.set("categorie", categorie);
    if (difficulte) params.set("difficulte", difficulte);

    try {
      const res = await fetch(`/api/tutoriels?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        onResults(data.resultats);
      }
    } catch (err) {
      console.error("Erreur recherche:", err);
    }

    setLoading(false);
  };


  // --- Réinitialisation ---

  const handleReset = () => {
    setQuery("");
    setCategorie("");
    setDifficulte("");
    setShowFilters(false);
    onReset();
  };


  // --- Un filtre est-il actif ? ---

  const hasFilters = query || categorie || difficulte;


  // =============================================
  //  Rendu
  // =============================================

  return (
    <section className="mb-8">

      {/* --- Barre de recherche --- */}

      <form onSubmit={handleSearch} className="flex gap-3 mb-4">


        <label className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]"
          />

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
          className={`
            flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold border-2 transition-colors
            ${showFilters
              ? "bg-[#000091] text-white border-[#000091]"
              : "bg-white text-[#3a3a3a] border-[#dddddd] hover:border-[#000091]"
            }
          `}
        >
          <SlidersHorizontal size={16} />
          Filtres
        </button>


        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#000091] text-white rounded-lg text-sm font-bold hover:bg-[#1212ff] transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Rechercher"}
        </button>
      </form>


      {showFilters && (
        <aside className="flex flex-wrap gap-4 p-5 bg-white border border-[#dddddd] rounded-lg mb-4">

        
          <fieldset className="flex-1 min-w-50">
            <legend className="text-xs font-bold text-[#3a3a3a] mb-2">
              Catégorie
            </legend>

            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full p-2.5 border-2 border-[#dddddd] rounded-lg text-sm focus:border-[#000091] focus:outline-none"
            >
              <option value="">Toutes les catégories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </fieldset>


          <fieldset className="flex-1 min-w-50">
            <legend className="text-xs font-bold text-[#3a3a3a] mb-2">
              Difficulté
            </legend>

            <select
              value={difficulte}
              onChange={(e) => setDifficulte(e.target.value)}
              className="w-full p-2.5 border-2 border-[#dddddd] rounded-lg text-sm focus:border-[#000091] focus:outline-none"
            >
              <option value="">Toutes les difficultés</option>
              {DIFFICULTES.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </fieldset>
        </aside>
      )}


      {hasFilters && (
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-sm font-bold text-[#000091] hover:underline"
        >
          <X size={14} />
          Réinitialiser la recherche
        </button>
      )}
    </section>
  );
}