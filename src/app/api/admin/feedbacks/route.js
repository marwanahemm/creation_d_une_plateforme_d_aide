import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  // --- Vérifier que l'admin est connecté ---

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  // --- Récupérer tous les feedbacks ---

  const { data, error } = await supabaseAdmin
    .from("feedbacks")
    .select("tutoriel_id, utile, commentaire, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur feedbacks:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }

  // --- Regrouper par tutoriel ---

  const stats = {};

  (data || []).forEach((row) => {
    if (!stats[row.tutoriel_id]) {
      stats[row.tutoriel_id] = { positifs: 0, negatifs: 0, commentaires: [] };
    }
    if (row.utile) {
      stats[row.tutoriel_id].positifs++;
    } else {
      stats[row.tutoriel_id].negatifs++;
    }
    if (row.commentaire) {
      stats[row.tutoriel_id].commentaires.push({
        texte: row.commentaire,
        utile: row.utile,
        date: row.created_at,
      });
    }
  });

  return NextResponse.json({ feedbacks: stats });
}