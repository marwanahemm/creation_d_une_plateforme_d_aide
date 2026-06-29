import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

async function verifierAdmin() {
  const cookieStore = await cookies()
  return !!cookieStore.get("admin_token")
}

// GET — liste tous les tutoriels
export async function GET() {
  if (!(await verifierAdmin()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const admin = getAdmin()
  if (!admin)
    return NextResponse.json({ error: "Configuration serveur manquante" }, { status: 500 })

  const { data, error } = await admin
    .from("tutoriels")
    .select("id, titre, categorie, duree, description, lien, infos, etapes, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur GET tutoriels :", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ tutoriels: data || [] })
}

// POST — créer un tutoriel
export async function POST(request) {
  if (!(await verifierAdmin()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const admin = getAdmin()
  if (!admin)
    return NextResponse.json({ error: "Configuration serveur manquante" }, { status: 500 })

  const body = await request.json()
  const { error } = await admin.from("tutoriels").insert(body)

  if (error) {
    console.error("Erreur POST tutoriel :", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// PUT — modifier un tutoriel
export async function PUT(request) {
  if (!(await verifierAdmin()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const admin = getAdmin()
  if (!admin)
    return NextResponse.json({ error: "Configuration serveur manquante" }, { status: 500 })

  const { id, ...donnees } = await request.json()
  if (!id)
    return NextResponse.json({ error: "id manquant" }, { status: 400 })

  const { error } = await admin.from("tutoriels").update(donnees).eq("id", id)

  if (error) {
    console.error("Erreur PUT tutoriel :", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// DELETE — supprimer un tutoriel
export async function DELETE(request) {
  if (!(await verifierAdmin()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const admin = getAdmin()
  if (!admin)
    return NextResponse.json({ error: "Configuration serveur manquante" }, { status: 500 })

  const { id } = await request.json()
  if (!id)
    return NextResponse.json({ error: "id manquant" }, { status: 400 })

  const { error } = await admin.from("tutoriels").delete().eq("id", id)

  if (error) {
    console.error("Erreur DELETE tutoriel :", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
