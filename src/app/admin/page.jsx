"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { Trash2, Plus, LogOut, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [tutoriels, setTutoriels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    titre: "",
    categorie: "",
    difficulte: "débutant",
    duree: "",
    description: "",
    lien: "",
    infos: "",
    etapes: "",
  });

  // ═══ VÉRIFIER LA SESSION AU CHARGEMENT ═══
  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => {
        if (res.ok) setIsLogged(true);
      })
      .finally(() => setChecking(false));
  }, []);

  // ═══ LOGIN (vérifié côté serveur) ═══
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

  // ═══ LOGOUT ═══
  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setIsLogged(false);
    setTutoriels([]);
  };

  // ═══ FETCH TUTORIELS ═══
  const fetchTutoriels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tutoriels")
      .select("id, titre, categorie, difficulte, duree")
      .order("created_at", { ascending: false });
    if (!error) setTutoriels(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isLogged) fetchTutoriels();
  }, [isLogged]);

  // ═══ DELETE ═══
  const handleDelete = async (id, titre) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return;
    const { error } = await supabase.from("tutoriels").delete().eq("id", id);
    if (!error) {
      setTutoriels(tutoriels.filter((t) => t.id !== id));
    }
  };

  // ═══ ADD ═══
  const handleAdd = async (e) => {
    e.preventDefault();

    let infosArray = [];
    if (form.infos.trim()) {
      infosArray = form.infos.split("\n").filter((l) => l.trim());
    }

    let etapesArray = [];
    if (form.etapes.trim()) {
      etapesArray = form.etapes
        .split("\n")
        .filter((l) => l.trim())
        .map((line) => {
          const parts = line.split("|");
          return {
            titre: (parts[0] || "").trim(),
            description: (parts[1] || "").trim(),
          };
        });
    }

    const { error } = await supabase.from("tutoriels").insert({
      titre: form.titre,
      categorie: form.categorie,
      difficulte: form.difficulte,
      duree: form.duree,
      description: form.description,
      lien: form.lien,
      infos: infosArray,
      etapes: etapesArray,
    });

    if (!error) {
      setForm({
        titre: "",
        categorie: "",
        difficulte: "débutant",
        duree: "",
        description: "",
        lien: "",
        infos: "",
        etapes: "",
      });
      setShowForm(false);
      fetchTutoriels();
    }
  };

  // ═══ CHARGEMENT ═══
  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily: "system-ui, sans-serif" }}>
        <p style={{ color: "#666" }}>Chargement...</p>
      </div>
    );
  }

  // ═══ PAGE DE CONNEXION ═══
  if (!isLogged) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily: "system-ui, sans-serif" }}>
        <form onSubmit={handleLogin} style={{ background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 24px rgba(0,0,0,.08)", width: "100%", maxWidth: "380px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <Lock size={20} color="#000091" />
            <h1 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#161616", margin: 0 }}>Administration</h1>
          </div>
          <label style={{ display: "block", fontSize: ".85rem", fontWeight: "600", color: "#3a3a3a", marginBottom: "6px" }}>
            Mot de passe
          </label>
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe"
              style={{ width: "100%", padding: "12px 44px 12px 14px", border: "2px solid #ddd", borderRadius: "8px", fontSize: ".95rem", outline: "none", boxSizing: "border-box" }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#666" }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p style={{ color: "#e1000f", fontSize: ".85rem", marginBottom: "12px" }}>{error}</p>}
          <button type="submit" style={{ width: "100%", padding: "12px", background: "#000091", color: "#fff", border: "none", borderRadius: "8px", fontSize: ".95rem", fontWeight: "700", cursor: "pointer" }}>
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  // ═══ DASHBOARD ═══
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "16px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#161616", margin: 0 }}>Administration</h1>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "1px solid #ddd", borderRadius: "8px", padding: "8px 16px", fontSize: ".85rem", fontWeight: "600", color: "#666", cursor: "pointer" }}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <p style={{ fontSize: ".95rem", color: "#666", margin: 0 }}>
            {tutoriels.length} tutoriel{tutoriels.length > 1 ? "s" : ""}
          </p>
          <button onClick={() => setShowForm(!showForm)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#000091", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: ".9rem", fontWeight: "700", cursor: "pointer" }}>
            <Plus size={18} /> Ajouter
          </button>
        </div>

        {/* Formulaire d'ajout */}
        {showForm && (
          <form onSubmit={handleAdd} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "28px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#161616", marginBottom: "20px" }}>Nouveau tutoriel</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Titre *</label>
                <input required value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} placeholder="Ex: Ameli - Assurance Maladie" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Catégorie *</label>
                <input required value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })} placeholder="Ex: Santé" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Difficulté</label>
                <select value={form.difficulte} onChange={(e) => setForm({ ...form, difficulte: e.target.value })} style={inputStyle}>
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Durée</label>
                <input value={form.duree} onChange={(e) => setForm({ ...form, duree: e.target.value })} placeholder="Ex: 10 min" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Décrivez le tutoriel en quelques phrases" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Lien officiel</label>
              <input value={form.lien} onChange={(e) => setForm({ ...form, lien: e.target.value })} placeholder="https://www.ameli.fr" style={inputStyle} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Infos utiles (une par ligne)</label>
              <textarea value={form.infos} onChange={(e) => setForm({ ...form, infos: e.target.value })} placeholder={"Votre numéro de sécurité sociale se trouve sur votre carte Vitale\nLe code d'activation est envoyé par courrier sous 48h"} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Étapes (format : Titre | Description, une par ligne)</label>
              <textarea value={form.etapes} onChange={(e) => setForm({ ...form, etapes: e.target.value })} placeholder={"Aller sur ameli.fr | Ouvrez votre navigateur et tapez ameli.fr\nCréer mon compte | Cliquez sur le bouton Mon compte en haut à droite"} rows={5} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" style={{ padding: "10px 24px", background: "#000091", color: "#fff", border: "none", borderRadius: "8px", fontSize: ".9rem", fontWeight: "700", cursor: "pointer" }}>
                Enregistrer
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 24px", background: "none", color: "#666", border: "1px solid #ddd", borderRadius: "8px", fontSize: ".9rem", fontWeight: "600", cursor: "pointer" }}>
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Liste */}
        {loading ? (
          <p style={{ color: "#666", textAlign: "center", padding: "40px" }}>Chargement...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {tutoriels.map((t) => (
              <div key={t.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: ".95rem", fontWeight: "700", color: "#161616" }}>{t.titre}</div>
                  <div style={{ fontSize: ".8rem", color: "#666", marginTop: "2px" }}>
                    {t.categorie} · {t.difficulte} · {t.duree}
                  </div>
                </div>
                <button onClick={() => handleDelete(t.id, t.titre)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "1px solid #fecaca", borderRadius: "8px", padding: "8px 12px", fontSize: ".8rem", fontWeight: "600", color: "#dc2626", cursor: "pointer" }}>
                  <Trash2 size={15} /> Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: ".82rem",
  fontWeight: "600",
  color: "#3a3a3a",
  marginBottom: "4px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "2px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: ".9rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};