import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import {
  Clock, Award,
  HeartPulse, Baby, Briefcase, FileText, ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

const ICONS = {
  Santé: <HeartPulse size={28} />,
  Famille: <Baby size={28} />,
  Emploi: <Briefcase size={28} />,
  Fiscalité: <FileText size={28} />,
  Sécurité: <ShieldCheck size={28} />,
};

const DIFF_COLORS = {
  "débutant": "bg-[#b8fec9] text-[#18753c]",
  "intermédiaire": "bg-[#fef3c7] text-[#92400e]",
  "avancé": "bg-[#fee2e2] text-[#991b1b]",
};

async function getTutoriels() {
  const { data, error } = await supabase
    .from("tutoriels")
    .select("*")
    .order("id");
  if (error) return [];
  return data;
}

export default async function TutorielsPage() {
  const tutoriels = await getTutoriels();

  return (
    <main className="min-h-screen bg-[#f6f6f6]" style={{ fontFamily: "'Source Sans 3', 'Trebuchet MS', Arial, sans-serif" }}>

      {/* NAV */}
      <nav className="bg-white border-b border-[#dddddd]">
        <section className="max-w-270 mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <Link href="/" className="flex items-center gap-2.5 font-black text-lg text-[#000091]">
            <span className="w-1 h-7 rounded-sm" style={{ background: "linear-gradient(180deg, #000091 50%, #e1000f 50%)" }} />
            Démarches Admin
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 bg-[#000091] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#1212ff] transition-colors">
            Accueil
          </Link>
        </section>
      </nav>

      {/* HEADER */}
      <header className="bg-[#000091] text-white py-12 px-6">
        <section className="max-w-270 mx-auto">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Tutoriels</h1>
          <p className="text-white/75 text-lg">Guides pas à pas pour vos démarches administratives</p>
        </section>
      </header>

      {/* LISTE */}
      <section className="max-w-270 mx-auto px-6 py-10">
        {tutoriels.length === 0 ? (
          <p className="text-center py-16 text-[#666666]">Aucun tutoriel disponible.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
            {tutoriels.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/tutoriels/${t.id}`}
                  className="block bg-white border border-[#dddddd] rounded-lg hover:border-[#000091] hover:shadow-md transition-all p-6 h-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-12 h-12 rounded-xl bg-[#f0f0ff] text-[#000091] flex items-center justify-center">
                      {ICONS[t.categorie] || <FileText size={28} />}
                    </span>
                    <span className="text-xs font-bold text-[#666666] uppercase tracking-wide">{t.categorie}</span>
                  </div>
                  <h2 className="text-base font-extrabold text-[#161616] mb-2">{t.titre}</h2>
                  <p className="text-sm text-[#666666] leading-relaxed mb-4 line-clamp-2">{t.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {t.difficulte && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${DIFF_COLORS[t.difficulte] || "bg-gray-100 text-gray-700"}`}>
                        <Award size={11} /> {t.difficulte}
                      </span>
                    )}
                    {t.duree && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 bg-[#f0f0f5] text-[#666666]">
                        <Clock size={11} /> {t.duree}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}