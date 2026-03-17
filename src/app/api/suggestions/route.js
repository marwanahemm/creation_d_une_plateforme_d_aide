import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // --- Récupérer les paramètres ---

    const q          = searchParams.get("q")?.trim() || "";
    const categorie  = searchParams.get("categorie")?.trim() || "";
    const difficulte = searchParams.get("difficulte")?.trim() || "";
    const tri        = searchParams.get("tri")?.trim() || "recent";


    // --- Construire la requête Supabase ---

    let query = supabase
      .from("suggestions")
      .select("id, titre, categorie, difficulte, duree, description, created_at")
      .eq("statut", "en_attente");


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


export async function POST(request) {
  try {
    const body = await request.json();
    const { titre, description, categorie, difficulte, duree, auteur_nom, auteur_email } = body;

    if (!titre?.trim()) {
      return NextResponse.json(
        { error: "Le titre est obligatoire." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("suggestions")
      .insert([{ titre, description, categorie, difficulte, duree, auteur_nom, auteur_email }])
      .select("id")
      .single();

    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id }, { status: 201 });

  } catch (err) {
    console.error("Erreur serveur:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
