import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";


/**
 * POST /api/tutoriels/[id]/vues
 *
 * Incrémente le compteur de vues d'un tutoriel.
 * Utilise supabaseAdmin pour bypasser les RLS (Row Level Security).
 */
export async function POST(request, { params }) {
  try {
    const { id } = await params;

    // Récupérer le nombre de vues actuel
    const { data, error: fetchError } = await supabaseAdmin
      .from("tutoriels")
      .select("vues")
      .eq("id", id)
      .single();

    if (fetchError || !data) {
      return NextResponse.json(
        { error: "Tutoriel introuvable." },
        { status: 404 }
      );
    }

    // Incrémenter de 1
    const { error: updateError } = await supabaseAdmin
      .from("tutoriels")
      .update({ vues: (data.vues || 0) + 1 })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, vues: (data.vues || 0) + 1 });

  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}