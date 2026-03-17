import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // --- Récupérer les paramètres ---

    const q          = searchParams.get("q")?.trim() || "";
    const categorie  = searchParams.get("categorie")?.trim() || "";
    const difficulte = searchParams.get("difficulte")?.trim() || "";
    const statut     = searchParams.get("statut")?.trim() || "";
    const tri        = searchParams.get("tri")?.trim() || "recent";


    // --- Construire la requête Supabase ---

    let query = supabase
      .from("suggestions")
      .select("id, titre, categorie, difficulte, duree, description, statut, auteur_nom, auteur_email, created_at");


    // Recherche textuelle (titre OU description)
    if (q) {
      query = query.or(
        `titre.ilike.%${q}%,description.ilike.%${q}%`
      );
    }

    // Filtre par catégorie
    if (categorie) {
      query = query.eq("categorie", categorie);
    }

    // Filtre par difficulté
    if (difficulte) {
      query = query.eq("difficulte", difficulte);
    }

    // Filtre par statut
    if (statut) {
      query = query.eq("statut", statut);
    }

    // Tri
    switch (tri) {
      case "ancien":
        query = query.order("created_at", { ascending: true });
        break;
      case "titre":
        query = query.order("titre", { ascending: true });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }


    // --- Exécuter la requête ---

    const { data, error } = await query;

    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors de la recherche." },
        { status: 500 }
      );
    }


    // --- Renvoyer les résultats ---

    return NextResponse.json({
      resultats: data || [],
      total: data?.length || 0,
    });

  } catch (err) {
    console.error("Erreur serveur:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}


export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, statut } = body;

    if (!id || !statut) {
      return NextResponse.json(
        { error: "id et statut sont obligatoires." },
        { status: 400 }
      );
    }

    const valides = ["en_attente", "approuve", "refuse"];
    if (!valides.includes(statut)) {
      return NextResponse.json(
        { error: `statut invalide. Valeurs acceptées : ${valides.join(", ")}` },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("suggestions")
      .update({ statut })
      .eq("id", id);

    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Erreur serveur:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
