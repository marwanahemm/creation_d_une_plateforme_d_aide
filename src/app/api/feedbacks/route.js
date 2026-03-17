import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

    // --- Vérifier si l'utilisateur a déjà voté (cookie) ---

    const cookieStore = await cookies();
    const cookieName = `feedback_${tutoriel_id}`;
    const existingVote = cookieStore.get(cookieName);

    // Si le cookie existe et qu'il n'y a pas de commentaire,
    // c'est un doublon de vote → on refuse
    if (existingVote && !commentaire) {
      return NextResponse.json(
        { error: "Vous avez déjà voté pour ce tutoriel." },
        { status: 409 }
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

    // --- Poser le cookie anti-doublon ---

    const response = NextResponse.json({ ok: true });

    // Cookie valable 1 an, non-httpOnly pour pouvoir le lire côté client
    response.cookies.set(cookieName, String(utile), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365, // 1 an
      path: "/",
    });

    // Si c'est un commentaire, poser aussi le cookie commentaire
    if (commentaire) {
      response.cookies.set(`${cookieName}_commentaire`, "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    return response;

  } catch (err) {
    console.error("Erreur serveur feedback:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}