import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import { ArrowLeft, Clock, Award, ExternalLink, HeartPulse, Baby, Briefcase, FileText, ShieldCheck, Info } from "lucide-react";

export const dynamic = "force-dynamic";

async function getTutoriel(id) {
  const { data, error } = await supabase
    .from("tutoriels")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur:", error);
    return null;
  }
  return data;
}

export default async function TutorielDetail({ params }) {
  const { id } = await params;
  const tutoriel = await getTutoriel(id);

  if (!tutoriel) {
    return (
      <div className="text-center py-16 text-[#666666]">Tutoriel non trouvé</div>
    );
  }

  const iconMap = {
    Santé: <HeartPulse size={40} />,
    Famille: <Baby size={40} />,
    Emploi: <Briefcase size={40} />,
    Fiscalité: <FileText size={40} />,
    Sécurité: <ShieldCheck size={40} />,
  };

  const iconBgMap = {
    Santé: "bg-white/15 text-white",
    Famille: "bg-white/15 text-white",
    Emploi: "bg-white/15 text-white",
    Fiscalité: "bg-white/15 text-white",
    Sécurité: "bg-white/15 text-white",
  };

  const getDiffColor = (d) => {
    switch (d) {
      case "débutant": return "bg-[#b8fec9] text-[#18753c]";
      case "intermédiaire": return "bg-[#fef3c7] text-[#92400e]";
      case "avancé": return "bg-[#fee2e2] text-[#991b1b]";
      default: return "bg-gray-100 text-gray-700";
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
          <div className="flex gap-2.5 flex-wrap">
            <Link
              href="/tutoriels"
              className="inline-flex items-center gap-1.5 border-2 border-[#000091] text-[#000091] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#f5f5fe] transition-colors"
            >
              <ArrowLeft size={16} />
              Tutoriels
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-[#000091] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#1212ff] transition-colors"
            >
              Accueil
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-[#000091] text-white py-12 px-6">
        <div className="max-w-190 mx-auto">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${iconBgMap[tutoriel.categorie] || "bg-white/15 text-white"}`}>
            {iconMap[tutoriel.categorie] || <FileText size={40} />}
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">{tutoriel.titre}</h1>
          <div className="flex gap-3 flex-wrap">
            {tutoriel.difficulte && (
              <span className={`px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${getDiffColor(tutoriel.difficulte)}`}>
                <Award size={14} />
                {tutoriel.difficulte}
              </span>
            )}
            {tutoriel.duree && (
              <span className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 bg-white/15 text-white">
                <Clock size={14} />
                {tutoriel.duree}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-190 mx-auto px-6 py-10">
        {/* Description */}
        <p className="text-lg text-[#3a3a3a] leading-relaxed mb-8">{tutoriel.description}</p>

        {/* Infos utiles */}
        {tutoriel.infos && tutoriel.infos.length > 0 && (
          <div className="bg-[#f5f5fe] border-l-4 border-[#000091] rounded-r-lg p-5 mb-10">
            <h3 className="font-extrabold text-[#000091] mb-3 flex items-center gap-2">
              <Info size={18} />
              Informations utiles
            </h3>
            <ul className="space-y-2">
              {tutoriel.infos.map((info, i) => (
                <li key={i} className="text-sm text-[#3a3a3a] pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-[#000091] before:font-bold">
                  {info}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Étapes */}
        {tutoriel.etapes && tutoriel.etapes.length > 0 && (
          <>
            <h2 className="text-2xl font-black text-[#161616] mb-6">Étapes à suivre</h2>
            {tutoriel.etapes.map((etape, i) => (
              <div key={i} className="bg-white border border-[#dddddd] rounded-lg p-6 mb-4 flex gap-5 items-start hover:border-[#000091] transition-colors">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#000091] text-white flex items-center justify-center font-black text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#161616] mb-1.5">{etape.titre}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">{etape.description}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Lien officiel */}
        {tutoriel.lien && (
          <div className="bg-[#000091] rounded-lg p-7 mt-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-black text-white">Accéder au site officiel</h2>
              <p className="text-sm text-white/75">Vous serez redirigé vers la plateforme officielle.</p>
            </div>
            <a
              href={tutoriel.lien}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#000091] px-6 py-3 rounded-lg text-sm font-extrabold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <ExternalLink size={16} />
              Ouvrir le site
            </a>
          </div>
        )}
      </div>
    </div>
  );
}