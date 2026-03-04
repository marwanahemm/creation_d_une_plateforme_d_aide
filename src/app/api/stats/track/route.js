import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { type } = body; // "visite" ou "page_vue"

    if (type === "visite") {
      await supabaseAdmin.rpc("increment_stats", {
        compteur: "visites",
        n: 1,
      });
    }

    // Toujours incrémenter les pages vues
    
    await supabaseAdmin.rpc("increment_stats", {
      compteur: "pages_vues",
      n: 1,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
