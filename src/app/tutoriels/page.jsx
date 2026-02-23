import Link from "next/link";
import supabase from "@/lib/supabase";
 
export default async function TutorielsPage() {
  const { data: tutoriels, error } = await supabase
    .from("tutoriels")
    .select("id, titre, categorie, difficulte, duree, description")
    .order("created_at", { ascending: false });
 
  if (error) {
    console.error(error);
    return <p className="text-red-500 p-8">Erreur lors du chargement des tutoriels.</p>;
  }
 
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Tutoriels</h1>
 
      {tutoriels.length === 0 ? (
        <p className="text-gray-500">Aucun tutoriel disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutoriels.map((t) => (
            <Link key={t.id} href={`/${t.id}`}>
              <div className="border rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col gap-3">
                <div className="flex flex-wrap gap-2 text-sm">
                  {t.categorie && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {t.categorie}
                    </span>
                  )}
                  {t.difficulte && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {t.difficulte}
                    </span>
                  )}
                  {t.duree && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {t.duree}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold">{t.titre}</h2>
                {t.description && (
                  <p className="text-gray-500 text-sm line-clamp-3">{t.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}