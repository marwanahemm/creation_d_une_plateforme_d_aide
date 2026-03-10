import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { password } = await request.json();

  // Hash du mot de passe stocké dans les variables d'environnement
  const adminPasswordHash = process.env.ADMIN_PASSWORD;

  if (!adminPasswordHash) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD non configuré sur le serveur" },
      { status: 500 }
    );
  }

  // Comparaison sécurisée avec bcrypt
  const match = await bcrypt.compare(password, adminPasswordHash);

  if (!match) {
    return NextResponse.json(
      { error: "Mot de passe incorrect" },
      { status: 401 }
    );
  }

  // Créer un token simple (en production, utiliser JWT)
  const token = Buffer.from(`admin:${Date.now()}`).toString("base64");

  const response = NextResponse.json({ success: true });

  // Stocker le token dans un cookie httpOnly (inaccessible en JS côté client)
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 4, // 4 heures
    path: "/",
  });

  return response;
}