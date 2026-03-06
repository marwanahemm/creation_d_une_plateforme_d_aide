"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import {
  Trash2,
  Plus,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  BarChart3,
  Users,
  FileText,
  Pencil,
  X,
} from "lucide-react";


// =============================================
//  Formulaire initial vide
// =============================================

const EMPTY_FORM = {
  titre: "",
  categorie: "",
  difficulte: "débutant",
  duree: "",
  description: "",
  lien: "",
  infos: "",
  etapes: "",
};


// =============================================
//  Composant principal
// =============================================

export default function AdminPage() {

  // --- États ---

  const [isLogged, setIsLogged]         = useState(false);
  const [checking, setChecking]         = useState(true);
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [tutoriels, setTutoriels]       = useState([]);
  const [loading, setLoading]           = useState(false);
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [stats, setStats]               = useState(null);
  const [editingId, setEditingId]       = useState(null);


  // --- Vérifier la session au chargement ---

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => {
        if (res.ok) setIsLogged(true);
      })
      .finally(() => setChecking(false));
  }, []);


  // --- Charger les tutoriels et les stats quand connecté ---

  useEffect(() => {
    if (isLogged) {
      fetchTutoriels();
      fetchStats();
    }
  }, [isLogged]);


  // --- Connexion ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsLogged(true);
      setPassword("");
    } else {
      const data = await res.json();
      setError(data.error || "Erreur de connexion");
    }
  };


  // --- Déconnexion ---

  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setIsLogged(false);
    setTutoriels([]);
    setStats(null);
  };


  // --- Récupérer les tutoriels depuis Supabase ---

  const fetchTutoriels = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("tutoriels")
      .select("id, titre, categorie, difficulte, duree, vues, description, lien, infos, etapes")
      .order("created_at", { ascending: false });

    if (!error) setTutoriels(data || []);

    setLoading(false);
  };


  // --- Récupérer les stats depuis Supabase ---

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from("stats")
      .select("compteur, valeur");

    if (!error && data) {
      const mapped = {};
      data.forEach((row) => {
        mapped[row.compteur] = row.valeur;
      });
      setStats(mapped);
    }
  };


  // --- Supprimer un tutoriel ---

  const handleDelete = async (id, titre) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return;

    const { error } = await supabase
      .from("tutoriels")
      .delete()
      .eq("id", id);

    if (!error) {
      setTutoriels(tutoriels.filter((t) => t.id !== id));
    }
  };


  // --- Ouvrir le formulaire en mode édition ---

  const handleEdit = (t) => {
    setEditingId(t.id);
    setShowForm(true);

    const infosText = Array.isArray(t.infos)
      ? t.infos.join("\n")
      : "";

    const etapesText = Array.isArray(t.etapes)
      ? t.etapes.map((e) => `${e.titre} | ${e.description}`).join("\n")
      : "";

    setForm({
      titre: t.titre || "",
      categorie: t.categorie || "",
      difficulte: t.difficulte || "débutant",
      duree: t.duree || "",
      description: t.description || "",
      lien: t.lien || "",
      infos: infosText,
      etapes: etapesText,
    });
  };


  // --- Annuler ---

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };


  // --- Soumettre (ajout OU modification) ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    const infosArray = form.infos.trim()
      ? form.infos.split("\n").filter((l) => l.trim())
      : [];

    const etapesArray = form.etapes.trim()
      ? form.etapes
          .split("\n")
          .filter((l) => l.trim())
          .map((line) => {
            const parts = line.split("|");
            return {
              titre: (parts[0] || "").trim(),
              description: (parts[1] || "").trim(),
            };
          })
      : [];

    const tutorielData = {
      titre: form.titre,
      categorie: form.categorie,
      difficulte: form.difficulte,
      duree: form.duree,
      description: form.description,
      lien: form.lien,
      infos: infosArray,
      etapes: etapesArray,
    };

    let error;

    if (editingId) {
      ({ error } = await supabase
        .from("tutoriels")
        .update(tutorielData)
        .eq("id", editingId));
    } else {
      ({ error } = await supabase
        .from("tutoriels")
        .insert(tutorielData));
    }

    if (!error) {
      setForm(EMPTY_FORM);
      setShowForm(false);
      setEditingId(null);
      fetchTutoriels();
    }
  };


  // =============================================
  //  Rendu — Écran de chargement
  // =============================================

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] font-[system-ui]">
        <p className="text-[#666666]">Chargement...</p>
      </div>
    );
  }


  // =============================================
  //  Rendu — Page de connexion
  // =============================================

  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] font-[system-ui] px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] w-full max-w-95"
        >
          {/* Titre */}
          <div className="flex items-center gap-2.5 mb-6">
            <Lock size={20} className="text-[#000091]" />
            <h1 className="text-xl font-extrabold text-[#161616]">
              Administration
            </h1>
          </div>

          {/* Champ mot de passe */}
          <label className="block text-sm font-semibold text-[#3a3a3a] mb-1.5">
            Mot de passe
          </label>

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe"
              className="w-full py-3 pl-3.5 pr-11 border-2 border-[#dddddd] rounded-lg text-sm outline-none focus:border-[#000091] transition-colors"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#161616]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-[#e1000f] text-sm mb-3">{error}</p>
          )}

          {/* Bouton */}
          <button
            type="submit"
            className="w-full py-3 bg-[#000091] text-white rounded-lg text-sm font-bold hover:bg-[#1212ff] transition-colors cursor-pointer"
          >
            Se connecter
          </button>
        </form>
      </div>
    );
  }


  // =============================================
  //  Rendu — Dashboard
  // =============================================

  return (
    <div className="min-h-screen bg-[#f9fafb] font-[system-ui]">

      {/* --- Header --- */}

      <header className="bg-white border-b border-[#e5e7eb] py-4 px-6">
        <div className="max-w-225 mx-auto flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-[#161616]">
            Administration
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 border border-[#dddddd] rounded-lg px-4 py-2 text-sm font-semibold text-[#666666] hover:border-[#000091] hover:text-[#000091] transition-colors cursor-pointer"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </header>


      {/* --- Contenu principal --- */}

      <main className="max-w-225 mx-auto px-6 py-8">

        {/* --- Bloc Statistiques --- */}

        <section className="grid grid-cols-3 gap-4 mb-8">

          {/* Carte : Tutoriels */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-[10px] bg-[#f5f5fe] text-[#000091] flex items-center justify-center">
                <FileText size={20} />
              </span>
              <span className="text-xs font-semibold text-[#666666]">Tutoriels</span>
            </div>
            <p className="text-3xl font-black text-[#161616]">{tutoriels.length}</p>
          </div>

          {/* Carte : Visites */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-[10px] bg-[#b8fec9] text-[#18753c] flex items-center justify-center">
                <Users size={20} />
              </span>
              <span className="text-xs font-semibold text-[#666666]">Visites</span>
            </div>
            <p className="text-3xl font-black text-[#161616]">
              {stats ? (stats.visites || 0) : "..."}
            </p>
          </div>

          {/* Carte : Pages vues */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-[10px] bg-[#fef3c7] text-[#92400e] flex items-center justify-center">
                <BarChart3 size={20} />
              </span>
              <span className="text-xs font-semibold text-[#666666]">Pages vues</span>
            </div>
            <p className="text-3xl font-black text-[#161616]">
              {stats ? (stats.pages_vues || 0) : "..."}
            </p>
          </div>
        </section>


        {/* --- Compteur + bouton --- */}

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-[#666666]">
            {tutoriels.length} tutoriel{tutoriels.length > 1 ? "s" : ""}
          </p>

          <button
            onClick={() => {
              if (showForm) {
                handleCancel();
              } else {
                setEditingId(null);
                setForm(EMPTY_FORM);
                setShowForm(true);
              }
            }}
            className={`flex items-center gap-1.5 text-white rounded-lg px-5 py-2.5 text-sm font-bold cursor-pointer transition-colors ${
              showForm
                ? "bg-[#666666] hover:bg-[#555555]"
                : "bg-[#000091] hover:bg-[#1212ff]"
            }`}
          >
            {showForm ? <><X size={18} /> Fermer</> : <><Plus size={18} /> Ajouter</>}
          </button>
        </div>


        {/* --- Formulaire d'ajout / modification --- */}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className={`bg-white rounded-xl p-7 mb-6 ${
              editingId
                ? "border-2 border-[#000091]"
                : "border border-[#e5e7eb]"
            }`}
          >
            <h2 className="text-lg font-bold text-[#161616] mb-5">
              {editingId ? "Modifier le tutoriel" : "Nouveau tutoriel"}
            </h2>

            {/* Ligne 1 : Titre + Catégorie */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#3a3a3a] mb-1">
                  Titre *
                </label>
                <input
                  required
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  placeholder="Ex: Ameli - Assurance Maladie"
                  className="w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm outline-none focus:border-[#000091] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3a3a3a] mb-1">
                  Catégorie *
                </label>
                <input
                  required
                  value={form.categorie}
                  onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                  placeholder="Ex: Santé"
                  className="w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm outline-none focus:border-[#000091] transition-colors"
                />
              </div>
            </div>

            {/* Ligne 2 : Difficulté + Durée */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#3a3a3a] mb-1">
                  Difficulté
                </label>
                <select
                  value={form.difficulte}
                  onChange={(e) => setForm({ ...form, difficulte: e.target.value })}
                  className="w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm outline-none focus:border-[#000091] transition-colors"
                >
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3a3a3a] mb-1">
                  Durée
                </label>
                <input
                  value={form.duree}
                  onChange={(e) => setForm({ ...form, duree: e.target.value })}
                  placeholder="Ex: 10 min"
                  className="w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm outline-none focus:border-[#000091] transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#3a3a3a] mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Décrivez le tutoriel en quelques phrases"
                rows={3}
                className="w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm outline-none focus:border-[#000091] transition-colors resize-y"
              />
            </div>

            {/* Lien officiel */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#3a3a3a] mb-1">
                Lien officiel
              </label>
              <input
                value={form.lien}
                onChange={(e) => setForm({ ...form, lien: e.target.value })}
                placeholder="https://www.ameli.fr"
                className="w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm outline-none focus:border-[#000091] transition-colors"
              />
            </div>

            {/* Infos utiles */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#3a3a3a] mb-1">
                Infos utiles (une par ligne)
              </label>
              <textarea
                value={form.infos}
                onChange={(e) => setForm({ ...form, infos: e.target.value })}
                placeholder={
                  "Votre numéro de sécurité sociale se trouve sur votre carte Vitale\n"
                  + "Le code d'activation est envoyé par courrier sous 48h"
                }
                rows={4}
                className="w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm outline-none focus:border-[#000091] transition-colors resize-y"
              />
            </div>

            {/* Étapes */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#3a3a3a] mb-1">
                Étapes (format : Titre | Description, une par ligne)
              </label>
              <textarea
                value={form.etapes}
                onChange={(e) => setForm({ ...form, etapes: e.target.value })}
                placeholder={
                  "Aller sur ameli.fr | Ouvrez votre navigateur et tapez ameli.fr\n"
                  + "Créer mon compte | Cliquez sur Mon compte en haut à droite"
                }
                rows={5}
                className="w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm outline-none focus:border-[#000091] transition-colors resize-y"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="submit"
                className={`px-6 py-2.5 text-white rounded-lg text-sm font-bold cursor-pointer transition-colors ${
                  editingId
                    ? "bg-[#18753c] hover:bg-[#145e30]"
                    : "bg-[#000091] hover:bg-[#1212ff]"
                }`}
              >
                {editingId ? "Sauvegarder les modifications" : "Enregistrer"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-[#dddddd] rounded-lg text-sm font-semibold text-[#666666] hover:border-[#000091] hover:text-[#000091] transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </form>
        )}


        {/* --- Liste des tutoriels --- */}

        {loading ? (
          <p className="text-[#666666] text-center py-10">Chargement...</p>
        ) : (
          <div className="flex flex-col gap-2">
            {tutoriels.map((t) => (
              <div
                key={t.id}
                className={`bg-white rounded-[10px] px-5 py-4 flex items-center justify-between gap-4 ${
                  editingId === t.id
                    ? "border-2 border-[#000091]"
                    : "border border-[#e5e7eb]"
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#161616]">
                    {t.titre}
                  </p>
                  <p className="text-xs text-[#666666] mt-0.5">
                    {t.categorie} · {t.difficulte} · {t.duree} · 👁 {t.vues || 0} vue{(t.vues || 0) > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="flex items-center gap-1 border border-[#e5e7eb] rounded-lg px-3 py-2 text-xs font-semibold text-[#000091] hover:border-[#000091] hover:bg-[#f5f5fe] transition-colors cursor-pointer"
                  >
                    <Pencil size={14} /> Modifier
                  </button>

                  <button
                    onClick={() => handleDelete(t.id, t.titre)}
                    className="flex items-center gap-1 border border-[#fecaca] rounded-lg px-3 py-2 text-xs font-semibold text-[#dc2626] hover:bg-[#fef2f2] transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}