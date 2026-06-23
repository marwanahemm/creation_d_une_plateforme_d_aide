'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

// Barre de recherche du hero : envoie vers la page des guides.
export default function HeroSearch() {
  const [valeur, setValeur] = useState('')
  const router = useRouter()

  function lancer() {
    const q = valeur.trim()
    router.push(q ? `/tutoriels?q=${encodeURIComponent(q)}` : '/tutoriels')
  }

  return (
    <div className="hero-search">
      <Search size={20} />
      <input
        type="text"
        placeholder="Quelle démarche ? (Ameli, CAF, France Travail…)"
        value={valeur}
        onChange={e => setValeur(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') lancer() }}
        aria-label="Rechercher un guide"
      />
      <button type="button" onClick={lancer}>Trouver mon guide</button>
    </div>
  )
}