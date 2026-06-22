"use client"

import { useRef, useState } from "react"
import supabase from "@/lib/supabaseClient"
import {
  Plus, Trash2, ImagePlus, Loader2, X,
  ChevronUp, ChevronDown, ImageOff,
} from "lucide-react"

// Nom du bucket Supabase Storage (créé via le SQL fourni)
const BUCKET = "captures"

const ETAPE_VIDE = { titre: "", description: "", image: "" }

/**
 * Éditeur d'étapes par blocs.
 *
 * Props :
 *  - etapes  : tableau d'objets { titre, description, image }
 *  - onChange: (nouveauTableau) => void
 *
 * Chaque étape gère son propre titre, sa description et sa capture d'écran.
 * Les captures sont déposées dans Supabase Storage (bucket "captures") et
 * l'URL publique est enregistrée dans le champ `image`, exactement le format
 * attendu par la page d'affichage du tutoriel.
 */
export default function EditeurEtapes({ etapes = [], onChange }) {
  // index de l'étape dont l'image est en cours d'upload (pour le spinner)
  const [enUpload, setEnUpload] = useState(null)
  const [erreur, setErreur]     = useState("")
  const inputsRef = useRef({})

  function majEtape(index, champ, valeur) {
    const copie = etapes.map((e, i) =>
      i === index ? { ...e, [champ]: valeur } : e
    )
    onChange(copie)
  }

  function ajouterEtape() {
    onChange([...etapes, { ...ETAPE_VIDE }])
  }

  function supprimerEtape(index) {
    onChange(etapes.filter((_, i) => i !== index))
  }

  function deplacerEtape(index, sens) {
    const cible = index + sens
    if (cible < 0 || cible >= etapes.length) return
    const copie = [...etapes]
    ;[copie[index], copie[cible]] = [copie[cible], copie[index]]
    onChange(copie)
  }

  async function televerserImage(index, fichier) {
    if (!fichier) return
    setErreur("")

    // Garde-fous simples
    if (!fichier.type.startsWith("image/")) {
      setErreur("Le fichier doit être une image.")
      return
    }
    if (fichier.size > 5 * 1024 * 1024) {
      setErreur("Image trop lourde (5 Mo maximum).")
      return
    }

    setEnUpload(index)
    try {
      const extension = fichier.name.split(".").pop()?.toLowerCase() || "png"
      const nom = `etape-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`

      const { error: erreurUpload } = await supabase
        .storage
        .from(BUCKET)
        .upload(nom, fichier, { cacheControl: "3600", upsert: false })

      if (erreurUpload) throw erreurUpload

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(nom)
      majEtape(index, "image", data.publicUrl)
    } catch (err) {
      console.error("Erreur upload capture :", err)
      setErreur("Échec de l'envoi de l'image. Vérifiez que le bucket « captures » existe.")
    } finally {
      setEnUpload(null)
    }
  }

  async function supprimerImage(index) {
    const url = etapes[index]?.image
    // Si l'image vient de Supabase Storage, on la supprime aussi du bucket.
    if (url && url.includes(`/${BUCKET}/`)) {
      const chemin = url.split(`/${BUCKET}/`)[1]?.split("?")[0]
      if (chemin) {
        try {
          await supabase.storage.from(BUCKET).remove([chemin])
        } catch (err) {
          console.error("Erreur suppression capture :", err)
        }
      }
    }
    majEtape(index, "image", "")
  }

  return (
    <div className="flex flex-col gap-4">
      {erreur && (
        <p className="text-[#e1000f] text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {erreur}
        </p>
      )}

      {etapes.length === 0 && (
        <p className="text-xs text-[#888] italic">
          Aucune étape pour l&apos;instant. Cliquez sur « Ajouter une étape » ci-dessous.
        </p>
      )}

      {etapes.map((etape, index) => (
        <article
          key={index}
          className="border-2 border-[#e5e7eb] rounded-xl p-4 bg-[#fafafa]"
        >
          {/* Barre du haut : numéro + déplacer + supprimer */}
          <header className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#000091] text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-xs font-semibold text-[#161616]">Étape {index + 1}</span>
            </span>
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => deplacerEtape(index, -1)}
                disabled={index === 0}
                title="Monter"
                className="p-1.5 rounded-md border border-[#e5e7eb] bg-white text-[#555] hover:text-[#000091] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => deplacerEtape(index, 1)}
                disabled={index === etapes.length - 1}
                title="Descendre"
                className="p-1.5 rounded-md border border-[#e5e7eb] bg-white text-[#555] hover:text-[#000091] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => supprimerEtape(index)}
                title="Supprimer l'étape"
                className="p-1.5 rounded-md border border-[#fecaca] bg-white text-[#dc2626] hover:bg-[#fef2f2] cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </span>
          </header>

          {/* Titre */}
          <label className="block mb-3">
            <span className="block text-xs font-semibold text-[#161616] mb-1">Titre de l&apos;étape</span>
            <input
              value={etape.titre || ""}
              onChange={(e) => majEtape(index, "titre", e.target.value)}
              placeholder="Ex : Aller sur ameli.fr"
              className="w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm text-[#161616] placeholder:text-[#aaa] outline-none focus:border-[#000091] transition-colors bg-white"
            />
          </label>

          {/* Description */}
          <label className="block mb-3">
            <span className="block text-xs font-semibold text-[#161616] mb-1">Description</span>
            <textarea
              value={etape.description || ""}
              onChange={(e) => majEtape(index, "description", e.target.value)}
              placeholder="Décrivez ce que l'utilisateur doit faire à cette étape."
              rows={3}
              className="w-full p-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm text-[#161616] placeholder:text-[#aaa] outline-none focus:border-[#000091] transition-colors bg-white resize-y"
            />
          </label>

          {/* Capture d'écran */}
          <div className="block">
            <span className="block text-xs font-semibold text-[#161616] mb-1">Capture d&apos;écran (facultatif)</span>

            {/* input file masqué, déclenché par le bouton */}
            <input
              ref={(el) => { inputsRef.current[index] = el }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                televerserImage(index, e.target.files?.[0])
                e.target.value = "" // permet de re-sélectionner le même fichier
              }}
            />

            {etape.image ? (
              <figure className="relative inline-block m-0 rounded-lg overflow-hidden border border-[#e5e7eb] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={etape.image}
                  alt={`Aperçu étape ${index + 1}`}
                  className="block max-h-40 w-auto"
                  onError={(e) => { e.currentTarget.style.display = "none" }}
                />
                <button
                  type="button"
                  onClick={() => supprimerImage(index)}
                  title="Retirer la capture"
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 border border-[#fecaca] text-[#dc2626] flex items-center justify-center hover:bg-[#fef2f2] cursor-pointer shadow-sm"
                >
                  <X size={15} />
                </button>
              </figure>
            ) : (
              <button
                type="button"
                onClick={() => inputsRef.current[index]?.click()}
                disabled={enUpload === index}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#cbd5e1] rounded-lg text-sm font-semibold text-[#555] hover:border-[#000091] hover:text-[#000091] bg-white disabled:opacity-50 cursor-pointer transition-colors"
              >
                {enUpload === index ? (
                  <><Loader2 size={16} className="animate-spin" /> Envoi en cours…</>
                ) : (
                  <><ImagePlus size={16} /> Déposer une capture</>
                )}
              </button>
            )}
          </div>
        </article>
      ))}

      <button
        type="button"
        onClick={ajouterEtape}
        className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-2 border-dashed border-[#000091]/40 rounded-lg text-sm font-bold text-[#000091] hover:bg-[#f5f5fe] cursor-pointer transition-colors"
      >
        <Plus size={16} /> Ajouter une étape
      </button>
    </div>
  )
}