import supabase from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

const categorieColors = {
  Santé: "bg-green-100 text-green-800",
  Famille: "bg-blue-100 text-blue-800",
  Emploi: "bg-orange-100 text-orange-800",
};

const difficulteColors = {
  débutant: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  intermédiaire: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  difficile: "bg-red-50 text-red-700 border border-red-200",
};

export default async function TutorielDetailPage({ params }) {
  const { data: tutoriel, error } = await supabase
    .from("tutoriels")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !tutoriel) notFound();

  const { titre, categorie, difficulte, duree, description, infos, etapes, lien } = tutoriel;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Retour */}
        <Link
          href="/tutoriels"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          ← Retour aux tutoriels
        </Link>

        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categorieColors[categorie] ?? "bg-gray-100 text-gray-700"}`}>
              {categorie}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${difficulteColors[difficulte] ?? "bg-gray-100 text-gray-700"}`}>
              {difficulte}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              ⏱ {duree}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">{titre}</h1>
          <p className="text-gray-600 text-base leading-relaxed">{description}</p>

          <a
            href={lien}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Accéder au site officiel →
          </a>
        </div>

        {/* Infos utiles */}
        {infos && infos.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-3">
              Infos utiles
            </h2>
            <ul className="space-y-2">
              {infos.map((info, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
                  <span className="mt-0.5 text-blue-400">ℹ</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Étapes */}
        {etapes && etapes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Étapes à suivre
            </h2>
            <ol className="space-y-6">
              {etapes.map((etape, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{etape.titre}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{etape.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

      </div>
    </main>
  );
}
