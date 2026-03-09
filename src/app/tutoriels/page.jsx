import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import {
  ArrowLeft, Clock, Award, ExternalLink, Eye,
  HeartPulse, Baby, Briefcase, FileText, ShieldCheck,
  Info, ZoomIn,
} from "lucide-react";

export const dynamic = "force-dynamic";

const ICONS = {
  Santé: <HeartPulse size={40} />,
  Famille: <Baby size={40} />,
  Emploi: <Briefcase size={40} />,
  Fiscalité: <FileText size={40} />,
  Sécurité: <ShieldCheck size={40} />,
};

const DIFF_COLORS = {
  "débutant": "bg-[#b8fec9] text-[#18753c]",
  "intermédiaire": "bg-[#fef3c7] text-[#92400e]",
  "avancé": "bg-[#fee2e2] text-[#991b1b]",
};

async function getTutoriel(id) {
  // ✅ CORRECTION : cast en nombre pour correspondre au type integer de Supabase
  const numericId = Number(id);

  if (isNaN(numericId)) return null;

  const { data, error } = await supabase
    .from("tutoriels")
    .select("*")
    .eq("id", numericId)
    .single();

  if (error) {
    console.error("Erreur Supabase :", error.message);
    return null;
  }

  return data;
}

export default async function TutorielDetail({ params }) {
  const { id } = await params;
  if (id === "landing.html") return null;

  const t = await getTutoriel(id);

  if (!t) {
    return <p className="text-center py-16 text-[#666666]">Tutoriel non trouvé</p>;
  }

  return (
    <main className="min-h-screen bg-[#f6f6f6]" style={{ fontFamily: "'Source Sans 3', 'Trebuchet MS', Arial, sans-serif" }}>

      {/* NAV */}
      <nav className="bg-white border-b border-[#dddddd]">
        <section className="max-w-270 mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <Link href="/" className="flex items-center gap-2.5 font-black text-lg text-[#000091]">
            <span className="w-1 h-7 rounded-sm" style={{ background: "linear-gradient(180deg, #000091 50%, #e1000f 50%)" }} />
            Démarches Admin
          </Link>
          <nav className="flex gap-2.5 flex-wrap">
            <Link href="/tutoriels" className="inline-flex items-center gap-1.5 border-2 border-[#000091] text-[#000091] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#f5f5fe] transition-colors">
              <ArrowLeft size={16} /> Tutoriels
            </Link>
            <a href="/" className="inline-flex items-center gap-1.5 bg-[#000091] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#1212ff] transition-colors">
              Accueil
            </a>
          </nav>
        </section>
      </nav>

      {/* HERO */}
      <header className="bg-[#000091] text-white py-12 px-6">
        <section className="max-w-190 mx-auto">
          <span className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-white/15">
            {ICONS[t.categorie] || <FileText size={40} />}
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">{t.titre}</h1>
          <ul className="flex gap-3 flex-wrap list-none p-0">
            {t.difficulte && (
              <li className={`px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${DIFF_COLORS[t.difficulte] || "bg-gray-100 text-gray-700"}`}>
                <Award size={14} /> {t.difficulte}
              </li>
            )}
            {t.duree && (
              <li className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 bg-white/15">
                <Clock size={14} /> {t.duree}
              </li>
            )}
            {t.vues > 0 && (
              <li className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 bg-white/15">
                <Eye size={14} /> Consulté {t.vues} fois
              </li>
            )}
          </ul>
        </section>
      </header>

      {/* CONTENU */}
      <article className="max-w-190 mx-auto px-6 py-10">
        <p className="text-lg text-[#3a3a3a] leading-relaxed mb-8">{t.description}</p>

        {/* Infos utiles */}
        {t.infos?.length > 0 && (
          <aside className="bg-[#f5f5fe] border-l-4 border-[#000091] rounded-r-lg p-5 mb-10">
            <h3 className="font-extrabold text-[#000091] mb-3 flex items-center gap-2">
              <Info size={18} /> Informations utiles
            </h3>
            <ul className="space-y-2">
              {t.infos.map((info, i) => (
                <li key={i} className="text-sm text-[#3a3a3a] pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-[#000091] before:font-bold">
                  {info}
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Étapes */}
        {t.etapes?.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-[#161616] mb-6">Étapes à suivre</h2>
            <ol className="list-none p-0 space-y-4">
              {t.etapes.map((etape, i) => (
                <li key={i} className="bg-white border border-[#dddddd] rounded-lg hover:border-[#000091] transition-colors overflow-hidden">
                  <article className="p-6 flex gap-5 items-start">
                    <span className="shrink-0 w-10 h-10 rounded-full bg-[#000091] text-white flex items-center justify-center font-black text-sm">
                      {i + 1}
                    </span>
                    <section>
                      <h3 className="text-base font-extrabold text-[#161616] mb-1.5">{etape.titre}</h3>
                      <p className="text-sm text-[#666666] leading-relaxed">{etape.description}</p>
                    </section>
                  </article>

                  {etape.image && (
                    <figure className="px-6 pb-6 m-0">
                      <figcaption className="flex items-center gap-2 px-3 py-2 bg-[#f0f0f5] border border-[#e5e7eb] rounded-t-lg text-xs font-semibold text-[#666666]">
                        <ZoomIn size={14} /> Capture d&apos;écran — Étape {i + 1}
                      </figcaption>
                      <img
                        src={etape.image}
                        alt={`Capture d'écran : ${etape.titre}`}
                        className="w-full h-auto border border-t-0 border-[#e5e7eb] rounded-b-lg"
                        loading="lazy"
                      />
                    </figure>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Lien officiel */}
        {t.lien && (
          <footer className="bg-[#000091] rounded-lg p-7 mt-10 flex items-center justify-between flex-wrap gap-4">
            <hgroup>
              <h2 className="text-lg font-black text-white">Accéder au site officiel</h2>
              <p className="text-sm text-white/75">Vous serez redirigé vers la plateforme officielle.</p>
            </hgroup>
            <a
              href={t.lien}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#000091] px-6 py-3 rounded-lg text-sm font-extrabold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <ExternalLink size={16} /> Ouvrir le site
            </a>
          </footer>
        )}
      </article>
    </main>
  );
}