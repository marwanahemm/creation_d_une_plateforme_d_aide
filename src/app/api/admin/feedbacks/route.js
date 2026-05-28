import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  const cookieStore  = await cookies()
  const tokenSession = cookieStore.get('admin_token')

  if (!tokenSession) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante.' }, { status: 500 })
  }

  const { data, error } = await supabaseAdmin
    .from('feedbacks')
    .select('tutoriel_id, utile')

  if (error) {
    console.error('Erreur Supabase feedbacks :', error)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }

  const statistiquesParTutoriel = {}

  ;(data || []).forEach(feedback => {
    if (!statistiquesParTutoriel[feedback.tutoriel_id]) {
      statistiquesParTutoriel[feedback.tutoriel_id] = { positifs: 0, negatifs: 0 }
    }
    feedback.utile
      ? statistiquesParTutoriel[feedback.tutoriel_id].positifs++
      : statistiquesParTutoriel[feedback.tutoriel_id].negatifs++
  })

  return NextResponse.json({ feedbacks: statistiquesParTutoriel })
}
