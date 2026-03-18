import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// --- GET : récupérer toutes les propositions ---
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Configuration serveur manquante" }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from("propositions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur propositions:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({ propositions: data || [] });
}

// --- PATCH : changer le statut d'une proposition ---
export async function PATCH(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id, statut } = await request.json();

  if (!id || !["nouvelle", "lue", "traitée"].includes(statut)) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Configuration serveur manquante" }, { status: 500 });
  }

  const { error } = await supabaseAdmin
    .from("propositions")
    .update({ statut })
    .eq("id", id);

  if (error) {
    console.error("Erreur update proposition:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}