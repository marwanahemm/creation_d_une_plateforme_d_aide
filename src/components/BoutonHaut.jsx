'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

// Bouton flottant « Retour en haut », apparaît après un peu de défilement.
export default function BoutonHaut() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Revenir en haut de la page"
      className="fixed bottom-5 right-5 z-20 w-11 h-11 rounded-full bg-[#000091] text-white shadow-lg flex items-center justify-center hover:bg-[#1212ff] transition-colors"
    >
      <ArrowUp size={20} />
    </button>
  )
}