import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const { tutoriel_id, utile, commentaire } = body;

    // --- Vérifications basiques ---

    if (!tutoriel_id || typeof utile !== "boolean") {
      return NextResponse.json(
        { error: "Données invalides. Il faut tutoriel_id (number) et utile (boolean)." },
        { status: 400 }
      );
    }

    // --- Construire le payload ---

    const payload = { tutoriel_id, utile };
    if (commentaire && typeof commentaire === "string") {
      payload.commentaire = commentaire.trim().slice(0, 1000) || null;
    }

    // --- Insérer le feedback dans Supabase ---

    const { error } = await supabase
      .from("feedbacks")
      .insert(payload);

    if (error) {
      console.error("Erreur Supabase feedback:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement du feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("Erreur serveur feedback:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}