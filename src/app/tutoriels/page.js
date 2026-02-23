import supabase from "@/lib/supabase";
import Link from "next/link";

const categorieColors = {
  Santé: "bg-green-100 text-green-800",
  Famille: "bg-blue-100 text-blue-800",
  Emploi: "bg-orange-100 text-orange-800",
};

const difficulteColors = {
  débutant: "text-emerald-700",
  intermédiaire: "text-yellow-700",
  difficile: "text-red-700",
};

export default async function TutorielsPage() {
  const { data: tutoriels, error } = await supabase
    .from("tutoriels")
    .select("id, titre, categorie, difficulte, duree, description")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">Erreur de chargement des tutoriels.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            ← Accueil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-3">Tutoriels</h1>
          <p className="text-gray-500 mt-1">{tutoriels.length} guide{tutoriels.length > 1 ? "s" : ""} disponible{tutoriels.length > 1 ? "s" : ""}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tutoriels.map((t) => (
            <Link
              key={t.id}
              href={`/${t.id}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-blue-100 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categorieColors[t.categorie] ?? "bg-gray-100 text-gray-700"}`}>
                  {t.categorie}
                </span>
                <span className="text-xs text-gray-400">⏱ {t.duree}</span>
              </div>

              <h2 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {t.titre}
              </h2>

              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {t.description}
              </p>

              <span className={`text-xs font-medium ${difficulteColors[t.difficulte] ?? "text-gray-500"}`}>
                {t.difficulte}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
