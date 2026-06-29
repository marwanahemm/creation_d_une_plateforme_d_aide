"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Trash2, Plus, LogOut, Lock, Eye, EyeOff,
  FileText, Pencil, X, ThumbsUp, ThumbsDown, LayoutDashboard, Lightbulb,
} from "lucide-react"
import EditeurEtapes from "@/components/admin/EditeurEtapes"

const FORMULAIRE_VIDE = {
  titre: "", categorie: "",
  duree: "", description: "", lien: "", infos: "", etapes: [],
}

const classeInput = "w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm text-[#161616] placeholder:text-[#aaa] outline-none focus:border-[#000091] transition-colors bg-white"

function couleurCategorie(categorie) {
  const c = (categorie || "").toLowerCase()
  if (c.includes("sant"))       return { bar: "#0d9488", bg: "#ccfbf1", text: "#0f766e" }
  if (c.includes("famille"))    return { bar: "#7c3aed", bg: "#ede9fe", text: "#6d28d9" }
  if (c.includes("emploi"))     return { bar: "#ea580c", bg: "#ffedd5", text: "#c2410c" }
  if (c.includes("fiscal"))     return { bar: "#16a34a", bg: "#dcfce7", text: "#15803d" }
  if (c.includes("quotidien"))  return { bar: "#0891b2", bg: "#cffafe", text: "#0e7490" }
  if (c.includes("sécurit")) return { bar: "#d97706", bg: "#fef3c7", text: "#b45309" }
  if (c.includes("logement"))   return { bar: "#db2777", bg: "#fce7f3", text: "#be185d" }
  if (c.includes("retraite"))   return { bar: "#6366f1", bg: "#e0e7ff", text: "#4338ca" }
  return { bar: "#000091", bg: "#f5f5fe", text: "#000091" }
}

export default function AdminPage() {
  const [estConnecte, setEstConnecte]     = useState(false)
  const [verification, setVerification]   = useState(true)
  const [motDePasse, setMotDePasse]       = useState("")
  const [afficherMdp, setAfficherMdp]     = useState(false)
  const [erreurConnexion, setErreurConnexion] = useState("")
  const [tutoriels, setTutoriels]         = useState([])
  const [chargement, setChargement]       = useState(false)
  const [formulaireVisible, setFormulaireVisible] = useState(false)
  const [formulaire, setFormulaire]       = useState(FORMULAIRE_VIDE)
  const [idEnEdition, setIdEnEdition]     = useState(null)
  const [statistiquesFeedbacks, setStatistiquesFeedbacks] = useState({})
  const [nbPropositionsNouvelles, setNbPropositionsNouvelles] = useState(0)

  useEffect(() => {
    fetch("/api/admin/session")
      .then(res => { if (res.ok) setEstConnecte(true) })
      .finally(() => setVerification(false))
  }, [])

  useEffect(() => {
    if (estConnecte) {
      chargerTutoriels()
      chargerFeedbacks()
      chargerNbPropositions()
    }
  }, [estConnecte])

  async function seConnecter(e) {
    e.preventDefault()
    setErreurConnexion("")
    const reponse = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: motDePasse }),
    })
    if (reponse.ok) { setEstConnecte(true); setMotDePasse("") }
    else { const d = await reponse.json(); setErreurConnexion(d.error || "Erreur") }
  }

  async function seDeconnecter() {
    await fetch("/api/admin/session", { method: "DELETE" })
    setEstConnecte(false); setTutoriels([]); setStatistiquesFeedbacks({})
  }

  async function chargerTutoriels() {
    setChargement(true)
    try {
      const res = await fetch("/api/admin/tutoriels")
      if (res.ok) {
        const d = await res.json()
        setTutoriels(d.tutoriels || [])
      }
    } catch (e) { console.error("Erreur chargement tutoriels :", e) }
    setChargement(false)
  }

  async function chargerFeedbacks() {
    try {
      const reponse = await fetch("/api/admin/feedbacks")
      if (reponse.ok) {
        const donnees = await reponse.json()
        setStatistiquesFeedbacks(donnees.feedbacks || {})
      }
    } catch (e) { console.error("Erreur feedbacks :", e) }
  }

  async function chargerNbPropositions() {
    try {
      const reponse = await fetch("/api/admin/propositions")
      if (reponse.ok) {
        const donnees = await reponse.json()
        setNbPropositionsNouvelles((donnees.propositions || []).filter(p => p.statut === "nouvelle").length)
      }
    } catch (e) { console.error("Erreur propositions :", e) }
  }

  async function supprimerTutoriel(id, titre) {
    if (!confirm(`Supprimer "${titre}" ?`)) return
    const res = await fetch("/api/admin/tutoriels", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) setTutoriels(tutoriels.filter(t => t.id !== id))
  }

  function ouvrirEdition(tutoriel) {
    setIdEnEdition(tutoriel.id)
    setFormulaireVisible(true)
    setFormulaire({
      titre:       tutoriel.titre       || "",
      categorie:   tutoriel.categorie   || "",
      duree:       tutoriel.duree       || "",
      description: tutoriel.description || "",
      lien:        tutoriel.lien        || "",
      infos:    Array.isArray(tutoriel.infos)   ? tutoriel.infos.join("\n") : "",
      etapes:   Array.isArray(tutoriel.etapes)
        ? tutoriel.etapes.map(e => ({
            titre:       e.titre       || "",
            description: e.description || "",
            image:       e.image       || "",
          }))
        : [],
    })
  }

  function fermerFormulaire() {
    setFormulaireVisible(false)
    setIdEnEdition(null)
    setFormulaire(FORMULAIRE_VIDE)
  }

  async function soumettreFormulaire(e) {
    e.preventDefault()
    const infosTableau  = formulaire.infos.trim() ? formulaire.infos.split("\n").filter(l => l.trim()) : []
    const etapesTableau = (formulaire.etapes || [])
      .filter(e => (e.titre || "").trim() || (e.description || "").trim() || e.image)
      .map(e => ({
        titre:       (e.titre || "").trim(),
        description: (e.description || "").trim(),
        image:       e.image || "",
      }))

    const donnees = {
      titre:       formulaire.titre,
      categorie:   formulaire.categorie,
      duree:       formulaire.duree,
      description: formulaire.description,
      lien:        formulaire.lien,
      infos:       infosTableau,
      etapes:      etapesTableau,
    }

    const res = await fetch("/api/admin/tutoriels", {
      method: idEnEdition ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idEnEdition ? { id: idEnEdition, ...donnees } : donnees),
    })
    if (res.ok) { fermerFormulaire(); chargerTutoriels() }
  }

  if (verification) return (
    <main className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
      <p className="text-[#161616]">Chargement...</p>
    </main>
  )

  if (!estConnecte) return (
    <main className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
      <form onSubmit={seConnecter} className="bg-white p-10 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] w-full max-w-95">
        <header className="flex items-center gap-2.5 mb-6">
          <Lock size={20} className="text-[#000091]" />
          <h1 className="text-xl font-extrabold text-[#161616]">Administration</h1>
        </header>
        <label className="block text-sm font-semibold text-[#161616] mb-1.5">Mot de passe</label>
        <span className="relative block mb-4">
          <input
            type={afficherMdp ? "text" : "password"}
            value={motDePasse}
            onChange={e => setMotDePasse(e.target.value)}
            placeholder="Entrez le mot de passe"
            className="w-full py-3 pl-3.5 pr-11 border-2 border-[#ddd] rounded-lg text-sm text-[#161616] bg-white placeholder:text-[#aaa] outline-none focus:border-[#000091]"
          />
          <button type="button" onClick={() => setAfficherMdp(!afficherMdp)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]">
            {afficherMdp ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
        {erreurConnexion && <p className="text-[#e1000f] text-sm mb-3">{erreurConnexion}</p>}
        <button type="submit" className="w-full py-3 bg-[#000091] text-white rounded-lg text-sm font-bold hover:bg-[#1212ff] cursor-pointer">
          Se connecter
        </button>
      </form>
    </main>
  )

  const totalPositifs = Object.values(statistiquesFeedbacks).reduce((t, s) => t + (s.positifs || 0), 0)
  const totalNegatifs = Object.values(statistiquesFeedbacks).reduce((t, s) => t + (s.negatifs || 0), 0)

  return (
    <main className="min-h-screen bg-[#f9fafb]">

      <header className="bg-white border-b border-[#e5e7eb] py-4 px-6">
        <nav className="max-w-225 mx-auto flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-[#161616]">Administration</h1>
          <menu className="flex items-center gap-3 list-none p-0 m-0">
            <li>
              <Link href="/admin/dashboard" className="flex items-center gap-1.5 border border-[#000091] text-[#000091] rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#f5f5fe]">
                <LayoutDashboard size={16} /> Feedbacks
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard" className="relative flex items-center gap-1.5 border border-amber-400 text-amber-600 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-amber-50">
                <Lightbulb size={16} /> Propositions
                {nbPropositionsNouvelles > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {nbPropositionsNouvelles}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <button onClick={seDeconnecter} className="flex items-center gap-1.5 border border-[#ddd] rounded-lg px-4 py-2 text-sm font-semibold text-[#161616] hover:border-[#000091] cursor-pointer">
                <LogOut size={16} /> Déconnexion
              </button>
            </li>
          </menu>
        </nav>
      </header>

      <section className="max-w-225 mx-auto px-6 py-8">

        <ul className="grid grid-cols-3 gap-4 mb-8 list-none p-0">
          <li className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <header className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-[10px] bg-[#f5f5fe] text-[#000091] flex items-center justify-center"><FileText size={20} /></span>
              <span className="text-xs font-semibold text-[#161616]">Tutoriels</span>
            </header>
            <p className="text-3xl font-black text-[#161616]">{tutoriels.length}</p>
          </li>
          <li className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <header className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-[10px] bg-green-50 text-green-600 flex items-center justify-center"><ThumbsUp size={20} /></span>
              <span className="text-xs font-semibold text-[#161616]">Avis positifs</span>
            </header>
            <p className="text-3xl font-black text-green-600">{totalPositifs}</p>
          </li>
          <li className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <header className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-[10px] bg-red-50 text-red-500 flex items-center justify-center"><ThumbsDown size={20} /></span>
              <span className="text-xs font-semibold text-[#161616]">Avis négatifs</span>
            </header>
            <p className="text-3xl font-black text-red-500">{totalNegatifs}</p>
          </li>
        </ul>

        <nav className="flex justify-between items-center mb-6">
          <p className="text-sm text-[#161616]">{tutoriels.length} tutoriel{tutoriels.length > 1 ? "s" : ""}</p>
          <button
            onClick={() => {
              if (formulaireVisible) fermerFormulaire()
              else { setIdEnEdition(null); setFormulaire(FORMULAIRE_VIDE); setFormulaireVisible(true) }
            }}
            className={`flex items-center gap-1.5 text-white rounded-lg px-5 py-2.5 text-sm font-bold cursor-pointer ${formulaireVisible ? "bg-[#0f0f0f]" : "bg-[#000091] hover:bg-[#1212ff]"}`}
          >
            {formulaireVisible ? <><X size={18} /> Fermer</> : <><Plus size={18} /> Ajouter</>}
          </button>
        </nav>

        {formulaireVisible && (
          <form onSubmit={soumettreFormulaire} className={`bg-white rounded-xl p-7 mb-6 ${idEnEdition ? "border-2 border-[#000091]" : "border border-[#e5e7eb]"}`}>
            <h2 className="text-lg font-bold text-[#161616] mb-5">
              {idEnEdition ? "Modifier le tutoriel" : "Nouveau tutoriel"}
            </h2>

            <fieldset className="grid grid-cols-2 gap-4 mb-4 border-0 p-0 m-0">
              <label className="block">
                <span className="block text-xs font-semibold text-[#161616] mb-1">Titre</span>
                <input value={formulaire.titre} onChange={e => setFormulaire({...formulaire, titre: e.target.value})}
                  placeholder="Ex : Ameli - Assurance Maladie" className={classeInput} />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-[#161616] mb-1">Catégorie</span>
                <input value={formulaire.categorie} onChange={e => setFormulaire({...formulaire, categorie: e.target.value})}
                  placeholder="Ex : Santé" className={classeInput} />
              </label>
            </fieldset>

            <label className="block mb-4">
              <span className="block text-xs font-semibold text-[#161616] mb-1">Durée</span>
              <input value={formulaire.duree} onChange={e => setFormulaire({...formulaire, duree: e.target.value})}
                placeholder="Ex : 10 min" className={classeInput} />
            </label>

            <label className="block mb-4">
              <span className="block text-xs font-semibold text-[#161616] mb-1">Description</span>
              <textarea value={formulaire.description} onChange={e => setFormulaire({...formulaire, description: e.target.value})}
                placeholder="Décrivez le tutoriel en quelques phrases" rows={3} className={`${classeInput} resize-y`} />
            </label>

            <label className="block mb-4">
              <span className="block text-xs font-semibold text-[#161616] mb-1">Lien officiel</span>
              <input value={formulaire.lien} onChange={e => setFormulaire({...formulaire, lien: e.target.value})}
                placeholder="https://www.ameli.fr" className={classeInput} />
            </label>

            <label className="block mb-4">
              <span className="block text-xs font-semibold text-[#161616] mb-1">Infos utiles (une par ligne)</span>
              <textarea value={formulaire.infos} onChange={e => setFormulaire({...formulaire, infos: e.target.value})}
                placeholder={"Votre numéro de sécurité sociale...\nLe code d'activation est envoyé par courrier sous 48h"}
                rows={4} className={`${classeInput} resize-y`} />
            </label>

            <div className="block mb-5">
              <span className="block text-xs font-semibold text-[#161616] mb-2">Étapes</span>
              <EditeurEtapes
                etapes={formulaire.etapes}
                onChange={nouvelles => setFormulaire({ ...formulaire, etapes: nouvelles })}
              />
            </div>

            <nav className="flex gap-3">
              <button type="submit" className={`px-6 py-2.5 text-white rounded-lg text-sm font-bold cursor-pointer ${idEnEdition ? "bg-[#18753c] hover:bg-[#145e30]" : "bg-[#000091] hover:bg-[#1212ff]"}`}>
                {idEnEdition ? "Sauvegarder" : "Enregistrer"}
              </button>
              <button type="button" onClick={fermerFormulaire} className="px-6 py-2.5 border border-[#ddd] rounded-lg text-sm font-semibold text-[#161616] cursor-pointer hover:border-[#000091]">
                Annuler
              </button>
            </nav>
          </form>
        )}

        {chargement ? (
          <p className="text-[#161616] text-center py-10">Chargement...</p>
        ) : (
          <ul className="flex flex-col gap-2 list-none p-0">
            {tutoriels.map(tutoriel => {
              const feedbackTutoriel = statistiquesFeedbacks[tutoriel.id]
              const couleur = couleurCategorie(tutoriel.categorie)
              const nbEtapes = Array.isArray(tutoriel.etapes) ? tutoriel.etapes.length : 0
              return (
                <li
                  key={tutoriel.id}
                  className={`bg-white rounded-xl flex items-stretch overflow-hidden shadow-sm ${idEnEdition === tutoriel.id ? "border-2 border-[#000091]" : "border border-[#e5e7eb]"}`}
                >
                  <span className="w-1.5 shrink-0" style={{ background: couleur.bar }} />
                  <article className="flex-1 flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#161616]">
                        {tutoriel.titre || <em className="text-[#aaa] font-normal">Sans titre</em>}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {tutoriel.categorie && (
                          <span
                            className="text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full"
                            style={{ background: couleur.bg, color: couleur.text }}
                          >
                            {tutoriel.categorie}
                          </span>
                        )}
                        <span className="text-xs text-[#888]">
                          {tutoriel.duree && `· ${tutoriel.duree}`}
                          {nbEtapes > 0 && ` · ${nbEtapes} étape${nbEtapes > 1 ? "s" : ""}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                        <ThumbsUp size={15} /> {feedbackTutoriel?.positifs || 0}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-bold text-red-500">
                        <ThumbsDown size={15} /> {feedbackTutoriel?.negatifs || 0}
                      </span>
                      <nav className="flex gap-2">
                        <button onClick={() => ouvrirEdition(tutoriel)} className="flex items-center gap-1.5 border border-[#e5e7eb] rounded-lg px-3 py-2 text-xs font-bold text-[#000091] hover:bg-[#f5f5fe] cursor-pointer transition-colors">
                          <Pencil size={13} /> Modifier
                        </button>
                        <button onClick={() => supprimerTutoriel(tutoriel.id, tutoriel.titre)} className="flex items-center gap-1.5 border border-[#fecaca] rounded-lg px-3 py-2 text-xs font-bold text-[#dc2626] hover:bg-[#fef2f2] cursor-pointer transition-colors">
                          <Trash2 size={13} /> Supprimer
                        </button>
                      </nav>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}
