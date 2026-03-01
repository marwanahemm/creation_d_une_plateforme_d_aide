import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Vérifier si l'admin est connecté
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    return NextResponse.json({ logged: false }, { status: 401 });
  }

  return NextResponse.json({ logged: true });
}

// Déconnexion
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}