"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import {
  ArrowLeft,
  HeartPulse,
  Baby,
  Briefcase,
  FileText,
  ShieldCheck,
} from "lucide-react";
import SearchBar from "./SearchBar";


// --- Icônes par catégorie ---

const ICON_MAP = {
  Santé:     <HeartPulse size={28} />,
  Famille:   <Baby size={28} />,
  Emploi:    <Briefcase size={28} />,
  Fiscalité: <FileText size={28} />,
  Sécurité:  <ShieldCheck size={28} />,
};


// --- Couleurs de fond des icônes ---

const ICON_BG_MAP = {
  Santé:     "bg-[#fee2e2] text-[#dc2626]",
  Famille:   "bg-[#fef3c7] text-[#d97706]",
  Emploi:    "bg-[#e0e7ff] text-[#4f46e5]",
  Fiscalité: "bg-[#f5f5fe] text-[#000091]",
  Sécurité:  "bg-[#b8fec9] text-[#18753c]",
};


// --- Couleur du badge de difficulté ---

function getDiffColor(d) {
  switch (d) {
    case "débutant":      return "bg-[#b8fec9] text-[#18753c]";
    case "intermédiaire": return "bg-[#fef3c7] text-[#92400e]";
    case "avancé":        return "bg-[#fee2e2] text-[#991b1b]";
    default:              return "bg-gray-100 text-gray-600";
  }
}


// =============================================
//  Page Tutoriels
// =============================================

export default function TutorielsPage() {

  // --- États ---

  const [allTutoriels, setAllTutoriels] = useState([]);
  const [tutoriels, setTutoriels]       = useState([]);
  const [isSearching, setIsSearching]   = useState(false);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);


  // --- Charger tous les tutoriels au démarrage ---

  useEffect(() => {
    async function fetchAll() {
      const { data, error } = await supabase
        .from("tutoriels")
        .select("id, titre, categorie, difficulte, duree, description")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setError("Erreur lors du chargement des tutoriels.");
      } else {
        setAllTutoriels(data || []);
        setTutoriels(data || []);
      }

      setLoading(false);
    }

    fetchAll();
  }, []);


  // --- Recevoir les résultats de recherche ---

  const handleResults = (resultats) => {
    setTutoriels(resultats);
    setIsSearching(true);
  };


  // --- Réinitialiser (retour à la liste complète) ---

  const handleReset = () => {
    setTutoriels(allTutoriels);
    setIsSearching(false);
  };


  // --- Écran d'erreur ---

  if (error) {
    return <p className="text-[#e1000f] p-8">{error}</p>;
  }


  // =============================================
  //  Rendu
  // =============================================

  return (
    <div
      className="min-h-screen bg-[#f6f6f6]"
      style={{
        fontFamily: "'Source Sans 3', 'Trebuchet MS', Arial, sans-serif",
      }}
    >
      {/* --- Navigation --- */}

      <nav className="bg-white border-b border-[#dddddd]">
        <div className="max-w-270 mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-black text-lg text-[#000091]"
          >
            <span
              className="w-1 h-7 rounded-sm"
              style={{
                background: "linear-gradient(180deg, #000091 50%, #e1000f 50%)",
              }}
            />
            Démarches Admin
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 bg-[#000091] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#1212ff] transition-colors"
          >
            <ArrowLeft size={16} />
            Accueil
          </Link>
        </div>
      </nav>


      {/* --- En-tête --- */}

      <header className="bg-[#000091] text-white py-12 px-6">
        <div className="max-w-270 mx-auto">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            Nos tutoriels
          </h1>
          <p className="text-base opacity-85 max-w-xl">
            Des guides pas à pas pour vous accompagner dans vos démarches
            administratives en ligne.
          </p>
        </div>
      </header>


      {/* --- Contenu --- */}

      <main className="max-w-270 mx-auto px-6 py-10">

        {/* Barre de recherche */}
        <SearchBar onResults={handleResults} onReset={handleReset} />

        {/* Indicateur de résultats */}
        {isSearching && (
          <p className="text-sm text-[#666666] mb-6">
            {tutoriels.length} résultat{tutoriels.length > 1 ? "s" : ""} trouvé{tutoriels.length > 1 ? "s" : ""}
          </p>
        )}

        {/* Chargement */}
        {loading ? (
          <p className="text-center text-[#666666] py-16 text-lg">
            Chargement...
          </p>
        ) : tutoriels.length === 0 ? (

          /* Aucun résultat */
          <article className="text-center py-16">
            <p className="text-lg text-[#666666] mb-4">
              {isSearching
                ? "Aucun tutoriel ne correspond à votre recherche."
                : "Aucun tutoriel disponible pour le moment."
              }
            </p>

            {isSearching && (
              <button
                onClick={handleReset}
                className="text-sm font-bold text-[#000091] hover:underline"
              >
                Voir tous les tutoriels
              </button>
            )}
          </article>

        ) : (

          /* Grille de tutoriels */
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tutoriels.map((t) => (
              <Link key={t.id} href={`/${t.id}`}>
                <article className="bg-white border border-[#dddddd] rounded-lg p-6 hover:shadow-lg hover:border-[#000091] transition-all cursor-pointer h-full flex flex-col gap-3">

                  {/* Icône */}
                  <span
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      ICON_BG_MAP[t.categorie] || "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {ICON_MAP[t.categorie] || <FileText size={28} />}
                  </span>

                  {/* Catégorie */}
                  {t.categorie && (
                    <span className="text-xs font-bold uppercase tracking-wide text-[#000091]">
                      {t.categorie}
                    </span>
                  )}

                  {/* Titre */}
                  <h2 className="text-base font-extrabold text-[#161616] leading-snug">
                    {t.titre}
                  </h2>

                  {/* Description */}
                  {t.description && (
                    <p className="text-sm text-[#666666] line-clamp-3 flex-1">
                      {t.description}
                    </p>
                  )}

                  {/* Badges */}
                  <footer className="flex flex-wrap gap-2 mt-2">
                    {t.difficulte && (
                      <mark
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${getDiffColor(t.difficulte)}`}
                      >
                        {t.difficulte}
                      </mark>
                    )}

                    {t.duree && (
                      <mark className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#f6f6f6] text-[#666666]">
                        ⏱ {t.duree}
                      </mark>
                    )}
                  </footer>

                  {/* CTA */}
                  <span className="text-sm font-bold text-[#000091] mt-2">
                    Commencer →
                  </span>
                </article>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}