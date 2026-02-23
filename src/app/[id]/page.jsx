import supabase from '@/lib/supabaseClient'
import Link from 'next/link'
import { ArrowLeft, Clock, Award, ExternalLink } from 'lucide-react'

async function getTutoriel(id) {
  const { data, error } = await supabase
    .from('tutoriels')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Erreur:', error)
    return null
  }
  
  return data
}

export default async function TutorielDetail({ params }) {
  const tutoriel = await getTutoriel(params.id)

  if (!tutoriel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Tutoriel non trouvé</p>
      </div>
    )
  }

  const icons = {
    'Santé': '🏥',
    'Famille': '👶',
    'Emploi': '💼',
  }

  const getDifficultyColor = (difficulte) => {
    switch(difficulte) {
      case 'débutant': return 'bg-green-100 text-green-700'
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-700'
      case 'avancé': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/tutoriels" 
        className="inline-flex items-center gap-2 text-indigo-600 mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux tutoriels
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="text-6xl mb-4">{icons[tutoriel.categorie] || '📄'}</div>
        <h1 className="text-4xl font-bold mb-4">{tutoriel.titre}</h1>
        
        <div className="flex gap-3 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getDifficultyColor(tutoriel.difficulte)}`}>
            <Award className="w-4 h-4" />
            {tutoriel.difficulte}
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {tutoriel.duree}
          </span>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-8">{tutoriel.description}</p>
          
          {/* Infos utiles */}
          {tutoriel.infos && tutoriel.infos.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
              <h3 className="font-bold text-blue-900 mb-2">ℹ️ Infos utiles</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                {tutoriel.infos.map((info, i) => (
                  <li key={i}>{info}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Étapes */}
          <h2 className="text-2xl font-bold mb-4">Étapes à suivre</h2>
          {tutoriel.etapes && tutoriel.etapes.map((etape, i) => (
            <div key={i} className="mb-6 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                Étape {i + 1} : {etape.titre}
              </h3>
              <p className="text-gray-700">{etape.description}</p>
            </div>
          ))}

          {/* Lien officiel */}
          {tutoriel.lien && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
              <h2 className="text-xl font-bold mb-3">Lien officiel</h2>
              <a 
                href={tutoriel.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 hover:underline text-lg"
              >
                <ExternalLink className="w-5 h-5" />
                Accéder au site officiel
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}