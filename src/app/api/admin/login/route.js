import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { password } = await request.json();

  const adminPasswordHash = process.env.ADMIN_PASSWORD;

  // LOG TEMPORAIRE pour déboguer
  console.log("Hash du .env :", adminPasswordHash);
  console.log("Mot de passe reçu :", password);

  if (!adminPasswordHash) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD non configuré sur le serveur" },
      { status: 500 }
    );
  }

  const match = await bcrypt.compare(password, adminPasswordHash);
  console.log("Résultat bcrypt.compare :", match);

  if (!match) {
    return NextResponse.json(
      { error: "Mot de passe incorrect" },
      { status: 401 }
    );
  }

  const token = Buffer.from(`admin:${Date.now()}`).toString("base64");
  const response = NextResponse.json({ success: true });

  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 4,
    path: "/",
  });

  return response;
}