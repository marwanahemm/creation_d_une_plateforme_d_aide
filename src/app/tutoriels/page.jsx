import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import { ArrowLeft, HeartPulse, Baby, Briefcase, FileText, ShieldCheck, ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TutorielsPage() {
  const { data: tutoriels, error } = await supabase
    .from("tutoriels")
    .select("id, titre, categorie, difficulte, duree, description")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <p className="text-[#e1000f] p-8">Erreur lors du chargement des tutoriels.</p>;
  }

  const iconMap = {
    Santé: <HeartPulse size={28} />,
    Famille: <Baby size={28} />,
    Emploi: <Briefcase size={28} />,
    Fiscalité: <FileText size={28} />,
    Sécurité: <ShieldCheck size={28} />,
  };

  const iconBgMap = {
    Santé: "bg-[#fee2e2] text-[#dc2626]",
    Famille: "bg-[#fef3c7] text-[#d97706]",
    Emploi: "bg-[#e0e7ff] text-[#4f46e5]",
    Fiscalité: "bg-[#f5f5fe] text-[#000091]",
    Sécurité: "bg-[#b8fec9] text-[#18753c]",
  };

  const getDiffColor = (d) => {
    switch (d) {
      case "débutant": return "bg-[#b8fec9] text-[#18753c]";
      case "intermédiaire": return "bg-[#fef3c7] text-[#92400e]";
      case "avancé": return "bg-[#fee2e2] text-[#991b1b]";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]" style={{ fontFamily: "'Source Sans 3', 'Trebuchet MS', Arial, sans-serif" }}>

      {/* NAV */}
      <nav className="bg-white border-b border-[#dddddd]">
        <div className="max-w-270 mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <Link href="/" className="flex items-center gap-2.5 font-black text-lg text-[#000091]">
            <div className="w-1 h-7 rounded-sm" style={{ background: "linear-gradient(180deg, #000091 50%, #e1000f 50%)" }}></div>
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

      {/* HEADER */}
      <div className="bg-[#000091] text-white py-12 px-6">
        <div className="max-w-270 mx-auto">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Nos tutoriels</h1>
          <p className="text-base opacity-85 max-w-xl">
            Des guides pas à pas pour vous accompagner dans vos démarches administratives en ligne.
          </p>
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-270 mx-auto px-6 py-10">
        {tutoriels.length === 0 ? (
          <p className="text-center text-[#666666] py-16 text-lg">Aucun tutoriel disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tutoriels.map((t) => (
              <Link key={t.id} href={`/${t.id}`}>
                <div className="bg-white border border-[#dddddd] rounded-lg p-6 hover:shadow-lg hover:border-[#000091] transition-all cursor-pointer h-full flex flex-col gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgMap[t.categorie] || "bg-gray-100 text-gray-500"}`}>
                    {iconMap[t.categorie] || <FileText size={28} />}
                  </div>
                  {t.categorie && (
                    <span className="text-xs font-bold uppercase tracking-wide text-[#000091]">
                      {t.categorie}
                    </span>
                  )}
                  <h2 className="text-base font-extrabold text-[#161616] leading-snug">{t.titre}</h2>
                  {t.description && (
                    <p className="text-sm text-[#666666] line-clamp-3 flex-1">{t.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {t.difficulte && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getDiffColor(t.difficulte)}`}>
                        {t.difficulte}
                      </span>
                    )}
                    {t.duree && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#f6f6f6] text-[#666666]">
                        ⏱ {t.duree}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-[#000091] mt-2">Commencer →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}