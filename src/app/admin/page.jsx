"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import {
  Trash2, Plus, LogOut, Lock, Eye, EyeOff,
  FileText, Pencil, X, ThumbsUp, ThumbsDown, LayoutDashboard,
} from "lucide-react";

const EMPTY_FORM = {
  titre: "", categorie: "", difficulte: "débutant",
  duree: "", description: "", lien: "", infos: "", etapes: "",
};

const inputClass = "w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm text-[#161616] placeholder:text-[#aaa] outline-none focus:border-[#000091] transition-colors bg-white";

export default function AdminPage() {
  const [isLogged, setIsLogged]         = useState(false);
  const [checking, setChecking]         = useState(true);
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [tutoriels, setTutoriels]       = useState([]);
  const [loading, setLoading]           = useState(false);
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [editingId, setEditingId]       = useState(null);
  const [feedbacks, setFeedbacks]       = useState({});

  useEffect(() => {
    fetch("/api/admin/session")
      .then(res => { if (res.ok) setIsLogged(true); })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (isLogged) { fetchTutoriels(); fetchFeedbacks(); }
  }, [isLogged]);

  const handleLogin = async (e) => {
    e.preventDefault(); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setIsLogged(true); setPassword(""); }
    else { const d = await res.json(); setError(d.error || "Erreur"); }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setIsLogged(false); setTutoriels([]); setFeedbacks({});
  };

  const fetchTutoriels = async () => {
    setLoading(true);
    const { data } = await supabase.from("tutoriels")
      .select("id, titre, categorie, difficulte, duree, description, lien, infos, etapes")
      .order("created_at", { ascending: false });
    setTutoriels(data || []); setLoading(false);
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/admin/feedbacks");
      if (res.ok) { const d = await res.json(); setFeedbacks(d.feedbacks || {}); }
    } catch (err) { console.error("Erreur feedbacks:", err); }
  };

  const handleDelete = async (id, titre) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return;
    const { error } = await supabase.from("tutoriels").delete().eq("id", id);
    if (!error) setTutoriels(tutoriels.filter(t => t.id !== id));
  };

  const handleEdit = (t) => {
    setEditingId(t.id); setShowForm(true);
    setForm({
      titre: t.titre || "", categorie: t.categorie || "", difficulte: t.difficulte || "débutant",
      duree: t.duree || "", description: t.description || "", lien: t.lien || "",
      infos: Array.isArray(t.infos) ? t.infos.join("\n") : "",
      etapes: Array.isArray(t.etapes) ? t.etapes.map(e => `${e.titre} | ${e.description}`).join("\n") : "",
    });
  };

  const handleCancel = () => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const infosArray = form.infos.trim() ? form.infos.split("\n").filter(l => l.trim()) : [];
    const etapesArray = form.etapes.trim()
      ? form.etapes.split("\n").filter(l => l.trim()).map(line => {
          const p = line.split("|");
          return { titre: (p[0]||"").trim(), description: (p[1]||"").trim() };
        }) : [];
    const data = {
      titre: form.titre, categorie: form.categorie, difficulte: form.difficulte,
      duree: form.duree, description: form.description, lien: form.lien,
      infos: infosArray, etapes: etapesArray,
    };
    let err;
    if (editingId) ({ error: err } = await supabase.from("tutoriels").update(data).eq("id", editingId));
    else ({ error: err } = await supabase.from("tutoriels").insert(data));
    if (!err) { handleCancel(); fetchTutoriels(); }
  };

  // --- Chargement ---
  if (checking) return (
    <main className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
      <p className="text-[#161616]">Chargement...</p>
    </main>
  );

  // --- Connexion ---
  if (!isLogged) return (
    <main className="min-h-screen flex items-center justify-center bg-[#f9fafb] font-[system-ui] px-4">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] w-full max-w-95">
        <header className="flex items-center gap-2.5 mb-6">
          <Lock size={20} className="text-[#000091]" />
          <h1 className="text-xl font-extrabold text-[#161616]">Administration</h1>
        </header>
        <label className="block text-sm font-semibold text-[#161616] mb-1.5">Mot de passe</label>
        <fieldset className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Entrez le mot de passe"
            className="w-full py-3 pl-3.5 pr-11 border-2 border-[#ddd] rounded-lg text-sm text-[#161616] bg-white placeholder:text-[#aaa] outline-none focus:border-[#000091]"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </fieldset>
        {error && <p className="text-[#e1000f] text-sm mb-3">{error}</p>}
        <button type="submit" className="w-full py-3 bg-[#000091] text-white rounded-lg text-sm font-bold hover:bg-[#1212ff] cursor-pointer">
          Se connecter
        </button>
      </form>
    </main>
  );

  // --- Dashboard admin ---
  const totalPos = Object.values(feedbacks).reduce((s, f) => s + (f.positifs || 0), 0);
  const totalNeg = Object.values(feedbacks).reduce((s, f) => s + (f.negatifs || 0), 0);

  return (
    <main className="min-h-screen bg-[#f9fafb] font-[system-ui]">

      <header className="bg-white border-b border-[#e5e7eb] py-4 px-6">
        <nav className="max-w-225 mx-auto flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-[#161616]">Administration</h1>
          <menu className="flex items-center gap-3 list-none p-0 m-0">
            <li>
              <Link href="/dashboard" className="flex items-center gap-1.5 border border-[#000091] text-[#000091] rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#f5f5fe] transition-colors">
                <LayoutDashboard size={16} /> Feedbacks
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-1.5 border border-[#ddd] rounded-lg px-4 py-2 text-sm font-semibold text-[#161616] hover:border-[#000091] transition-colors cursor-pointer">
                <LogOut size={16} /> Déconnexion
              </button>
            </li>
          </menu>
        </nav>
      </header>

      <section className="max-w-225 mx-auto px-6 py-8">

        {/* Stats */}
        <ul className="grid grid-cols-3 gap-4 mb-8 list-none p-0">
          <li className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <span className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-[10px] bg-[#f5f5fe] text-[#000091] flex items-center justify-center"><FileText size={20} /></span>
              <span className="text-xs font-semibold text-[#161616]">Tutoriels</span>
            </span>
            <p className="text-3xl font-black text-[#161616]">{tutoriels.length}</p>
          </li>
          <li className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <span className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-[10px] bg-green-50 text-green-600 flex items-center justify-center"><ThumbsUp size={20} /></span>
              <span className="text-xs font-semibold text-[#161616]">Avis positifs</span>
            </span>
            <p className="text-3xl font-black text-green-600">{totalPos}</p>
          </li>
          <li className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <span className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-[10px] bg-red-50 text-red-500 flex items-center justify-center"><ThumbsDown size={20} /></span>
              <span className="text-xs font-semibold text-[#161616]">Avis négatifs</span>
            </span>
            <p className="text-3xl font-black text-red-500">{totalNeg}</p>
          </li>
        </ul>

        {/* Actions */}
        <nav className="flex justify-between items-center mb-6">
          <p className="text-sm text-[#161616]">{tutoriels.length} tutoriel{tutoriels.length > 1 ? "s" : ""}</p>
          <button
            onClick={() => { if (showForm) handleCancel(); else { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); } }}
            className={`flex items-center gap-1.5 text-white rounded-lg px-5 py-2.5 text-sm font-bold cursor-pointer ${showForm ? "bg-[#0f0f0f]" : "bg-[#000091] hover:bg-[#1212ff]"}`}
          >
            {showForm ? <><X size={18} /> Fermer</> : <><Plus size={18} /> Ajouter</>}
          </button>
        </nav>

        {/* Formulaire */}
        {showForm && (
          <form onSubmit={handleSubmit} className={`bg-white rounded-xl p-7 mb-6 ${editingId ? "border-2 border-[#000091]" : "border border-[#e5e7eb]"}`}>
            <h2 className="text-lg font-bold text-[#161616] mb-5">
              {editingId ? "Modifier le tutoriel" : "Nouveau tutoriel"}
            </h2>

            <fieldset className="grid grid-cols-2 gap-4 mb-4">
              <label className="block">
                <span className="block text-xs font-semibold text-[#161616] mb-1">Titre *</span>
                <input required value={form.titre} onChange={e => setForm({...form, titre: e.target.value})}
                  placeholder="Ex: Ameli - Assurance Maladie" className={inputClass} />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-[#161616] mb-1">Catégorie *</span>
                <input required value={form.categorie} onChange={e => setForm({...form, categorie: e.target.value})}
                  placeholder="Ex: Santé" className={inputClass} />
              </label>
            </fieldset>

            <fieldset className="grid grid-cols-2 gap-4 mb-4">
              <label className="block">
                <span className="block text-xs font-semibold text-[#161616] mb-1">Difficulté</span>
                <select value={form.difficulte} onChange={e => setForm({...form, difficulte: e.target.value})} className={inputClass}>
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-[#161616] mb-1">Durée</span>
                <input value={form.duree} onChange={e => setForm({...form, duree: e.target.value})}
                  placeholder="Ex: 10 min" className={inputClass} />
              </label>
            </fieldset>

            <label className="block mb-4">
              <span className="block text-xs font-semibold text-[#161616] mb-1">Description</span>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Décrivez le tutoriel en quelques phrases" rows={3} className={`${inputClass} resize-y`} />
            </label>

            <label className="block mb-4">
              <span className="block text-xs font-semibold text-[#161616] mb-1">Lien officiel</span>
              <input value={form.lien} onChange={e => setForm({...form, lien: e.target.value})}
                placeholder="https://www.ameli.fr" className={inputClass} />
            </label>

            <label className="block mb-4">
              <span className="block text-xs font-semibold text-[#161616] mb-1">Infos utiles (une par ligne)</span>
              <textarea value={form.infos} onChange={e => setForm({...form, infos: e.target.value})}
                placeholder={"Votre numéro de sécurité sociale...\nLe code d'activation est envoyé par courrier sous 48h"}
                rows={4} className={`${inputClass} resize-y`} />
            </label>

            <label className="block mb-5">
              <span className="block text-xs font-semibold text-[#161616] mb-1">Étapes (format : Titre | Description, une par ligne)</span>
              <textarea value={form.etapes} onChange={e => setForm({...form, etapes: e.target.value})}
                placeholder={"Aller sur ameli.fr | Ouvrez votre navigateur et tapez ameli.fr\nCréer mon compte | Cliquez sur Mon compte en haut à droite"}
                rows={5} className={`${inputClass} resize-y`} />
            </label>

            <nav className="flex gap-3">
              <button type="submit" className={`px-6 py-2.5 text-white rounded-lg text-sm font-bold cursor-pointer ${editingId ? "bg-[#18753c] hover:bg-[#145e30]" : "bg-[#000091] hover:bg-[#1212ff]"}`}>
                {editingId ? "Sauvegarder" : "Enregistrer"}
              </button>
              <button type="button" onClick={handleCancel} className="px-6 py-2.5 border border-[#ddd] rounded-lg text-sm font-semibold text-[#161616] cursor-pointer hover:border-[#000091] transition-colors">
                Annuler
              </button>
            </nav>
          </form>
        )}

        {/* Liste tutoriels */}
        {loading ? <p className="text-[#161616] text-center py-10">Chargement...</p> : (
          <ul className="flex flex-col gap-2 list-none p-0">
            {tutoriels.map(t => {
              const fb = feedbacks[t.id];
              return (
                <li key={t.id} className={`bg-white rounded-[10px] px-5 py-4 flex items-center justify-between gap-4 ${editingId === t.id ? "border-2 border-[#000091]" : "border border-[#e5e7eb]"}`}>
                  <article className="flex-1">
                    <p className="text-sm font-bold text-[#161616]">{t.titre}</p>
                    <p className="text-xs text-[#555] mt-0.5">{t.categorie} · {t.difficulte} · {t.duree}</p>
                    {fb && (
                      <p className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-600"><ThumbsUp size={12} /> {fb.positifs || 0}</span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-500"><ThumbsDown size={12} /> {fb.negatifs || 0}</span>
                      </p>
                    )}
                  </article>
                  <nav className="flex gap-2">
                    <button onClick={() => handleEdit(t)} className="flex items-center gap-1 border border-[#e5e7eb] rounded-lg px-3 py-2 text-xs font-semibold text-[#000091] hover:bg-[#f5f5fe] cursor-pointer">
                      <Pencil size={14} /> Modifier
                    </button>
                    <button onClick={() => handleDelete(t.id, t.titre)} className="flex items-center gap-1 border border-[#fecaca] rounded-lg px-3 py-2 text-xs font-semibold text-[#dc2626] hover:bg-[#fef2f2] cursor-pointer">
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </nav>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}