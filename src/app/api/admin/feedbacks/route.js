import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET() {
  const cookieStore = await cookies()
  if (!cookieStore.get("admin_token"))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const admin = getAdmin()
  if (!admin) {
    console.error("feedbacks: SUPABASE_SERVICE_ROLE_KEY manquant")
    return NextResponse.json({ error: "Configuration serveur manquante" }, { status: 500 })
  }

  const { data, error } = await admin
    .from("feedbacks")
    .select("tutoriel_id, utile, commentaire, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur feedbacks Supabase:", JSON.stringify(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const stats = {}
  ;(data || []).forEach((row) => {
    if (!stats[row.tutoriel_id])
      stats[row.tutoriel_id] = { positifs: 0, negatifs: 0, commentaires: [] }
    if (row.utile) stats[row.tutoriel_id].positifs++
    else           stats[row.tutoriel_id].negatifs++
    if (row.commentaire)
      stats[row.tutoriel_id].commentaires.push({
        texte: row.commentaire,
        utile: row.utile,
        date: row.created_at,
      })
  })

  return NextResponse.json({ feedbacks: stats })
}
