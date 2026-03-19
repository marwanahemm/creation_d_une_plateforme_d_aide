import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sujet, description } = body;

    // --- Vérification ---
    if (!sujet || typeof sujet !== "string" || !sujet.trim()) {
      return NextResponse.json(
        { error: "Le sujet est obligatoire." },
        { status: 400 }
      );
    }

    // --- Construire le payload ---
    const payload = {
      sujet: sujet.trim().slice(0, 200),
      description: description?.trim().slice(0, 1000) || null,
    };

    // --- Insérer dans Supabase ---
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Configuration serveur manquante." }, { status: 500 });
    }

    const { error } = await supabaseAdmin
      .from("propositions")
      .insert(payload);

    if (error) {
      console.error("Erreur Supabase proposition:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement.", detail: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("Erreur serveur proposition:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}